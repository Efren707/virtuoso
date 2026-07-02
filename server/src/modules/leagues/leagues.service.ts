import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { League, ScoringType } from '../../entities/league.entity';
import { SleeperService } from '../sleeper/sleeper.service';
import { SleeperLeague } from '../sleeper/sleeper.types';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(League) private readonly leagueRepo: Repository<League>,
    private readonly sleeperService: SleeperService,
  ) {}

  async syncAndFetch(userId: string): Promise<League[]> {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });

    if (!user.sleeperId) {
      throw new BadRequestException('Sleeper account not linked');
    }

    // Fetch the current year's leagues from Sleeper
    // TODO: make the season user-selectable in a later phase
    // const year = new Date().getFullYear().toString();
    const year = '2025';
    const sleeperLeagues = await this.sleeperService.getLeaguesForUser(
      user.sleeperId,
      year,
    );

    const leagues = await Promise.all(
      sleeperLeagues.map((sl) => this.upsertLeague(sl)),
    );

    // Sync the user ↔ league join table so future DB queries are accurate
    user.leagues = leagues;
    await this.userRepo.save(user);

    return leagues;
  }

  private async upsertLeague(sl: SleeperLeague): Promise<League> {
    let league = await this.leagueRepo.findOne({
      where: { sleeperId: sl.league_id },
    });

    if (!league) {
      league = this.leagueRepo.create();
    }

    league.sleeperId = sl.league_id;
    league.name = sl.name;
    league.season = sl.season;
    league.status = sl.status;
    league.scoringType = deriveScoringType(sl.scoring_settings);
    league.totalRosters = sl.total_rosters;
    league.draftId = sl.draft_id;

    return this.leagueRepo.save(league);
  }
}

function deriveScoringType(settings: Record<string, number>): ScoringType {
  const rec = settings['rec'] ?? 0;
  if (rec >= 1) return ScoringType.PPR;
  if (rec >= 0.5) return ScoringType.HALF_PPR;
  return ScoringType.STANDARD;
}
