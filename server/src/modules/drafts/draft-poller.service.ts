import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { League } from '../../entities/league.entity';
import { Player } from '../../entities/player.entity';
import { DraftPick } from '../../entities/draft-pick.entity';
import { SleeperService } from '../sleeper/sleeper.service';
import { SleeperPick } from '../sleeper/sleeper.types';

export const DRAFT_POLL_INTERVAL_MS = 3000;

export interface RelayedPick {
  draftId: string;
  round: number;
  pickNumber: number;
  pickedBy: string;
  sleeperPlayerId: string;
}

interface PollState {
  intervalHandle: ReturnType<typeof setInterval>;
  seenPickNumbers: Set<number>;
  refCount: number;
}

@Injectable()
export class DraftPollerService implements OnModuleDestroy {
  private readonly logger = new Logger(DraftPollerService.name);
  private readonly activePolls = new Map<string, PollState>();

  constructor(
    private readonly sleeperService: SleeperService,
    @InjectRepository(League) private readonly leagueRepo: Repository<League>,
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>,
    @InjectRepository(DraftPick)
    private readonly draftPickRepo: Repository<DraftPick>,
  ) {}

  subscribe(draftId: string, onNewPicks: (picks: RelayedPick[]) => void): void {
    const existing = this.activePolls.get(draftId);
    if (existing) {
      existing.refCount += 1;
      return;
    }

    const state: PollState = {
      seenPickNumbers: new Set(),
      refCount: 1,
      intervalHandle: setInterval(() => {
        void this.pollOnce(draftId, onNewPicks);
      }, DRAFT_POLL_INTERVAL_MS),
    };
    this.activePolls.set(draftId, state);
    void this.pollOnce(draftId, onNewPicks);
  }

  unsubscribe(draftId: string): void {
    const state = this.activePolls.get(draftId);
    if (!state) return;
    state.refCount -= 1;
    if (state.refCount <= 0) {
      clearInterval(state.intervalHandle);
      this.activePolls.delete(draftId);
    }
  }

  async getPicks(draftId: string): Promise<RelayedPick[]> {
    const picks = await this.draftPickRepo.find({
      where: { draftId },
      order: { pickNumber: 'ASC' },
    });

    return picks.map((p) => ({
      draftId: p.draftId,
      round: p.round,
      pickNumber: p.pickNumber,
      pickedBy: p.pickedBy,
      sleeperPlayerId: p.sleeperPlayerId ?? '',
    }));
  }

  private async pollOnce(
    draftId: string,
    onNewPicks: (picks: RelayedPick[]) => void,
  ): Promise<void> {
    const state = this.activePolls.get(draftId);
    if (!state) return;

    let picks: SleeperPick[];
    try {
      picks = await this.sleeperService.getDraftPicks(draftId);
    } catch (err) {
      this.logger.warn(`Poll failed for draft ${draftId}: ${String(err)}`);
      return;
    }

    const newPicks = picks.filter((p) => !state.seenPickNumbers.has(p.pick_no));
    if (newPicks.length === 0) return;

    newPicks.forEach((p) => state.seenPickNumbers.add(p.pick_no));

    await Promise.all(
      newPicks.map((p) =>
        this.persistPick(draftId, p).catch((err: unknown) => {
          this.logger.warn(
            `Failed to persist pick_no=${p.pick_no} for draft ${draftId}: ${String(err)}`,
          );
        }),
      ),
    );

    onNewPicks(
      newPicks.map((p) => ({
        draftId,
        round: p.round,
        pickNumber: p.pick_no,
        pickedBy: p.picked_by ?? '',
        sleeperPlayerId: p.player_id,
      })),
    );
  }

  private async persistPick(draftId: string, pick: SleeperPick): Promise<void> {
    const league = await this.leagueRepo.findOne({ where: { draftId } });
    if (!league) {
      this.logger.warn(
        `No League found for draftId=${draftId}; skipping DB persistence of pick_no=${pick.pick_no} (still relayed live)`,
      );
      return;
    }

    const player = pick.player_id
      ? await this.playerRepo.findOne({ where: { sleeperId: pick.player_id } })
      : null;

    const draftPick = this.draftPickRepo.create({
      draftId,
      round: pick.round,
      pickNumber: pick.pick_no,
      pickedBy: pick.picked_by ?? '',
      sleeperPlayerId: pick.player_id ?? null,
      player: player ?? null,
      league,
    });

    await this.draftPickRepo.save(draftPick);
  }

  onModuleDestroy(): void {
    for (const state of this.activePolls.values()) {
      clearInterval(state.intervalHandle);
    }
    this.activePolls.clear();
  }
}
