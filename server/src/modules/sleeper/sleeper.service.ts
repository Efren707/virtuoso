import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SleeperLeague, SleeperPick, SleeperUser } from './sleeper.types';

const SLEEPER_BASE_URL = 'https://api.sleeper.app/v1';

@Injectable()
export class SleeperService {
  constructor(private readonly http: HttpService) {}

  async getUser(username: string): Promise<SleeperUser> {
    const { data } = await firstValueFrom(
      this.http.get<SleeperUser>(`${SLEEPER_BASE_URL}/user/${username}`),
    );
    return data;
  }

  async getLeaguesForUser(
    userId: string,
    season: string,
  ): Promise<SleeperLeague[]> {
    const { data } = await firstValueFrom(
      this.http.get<SleeperLeague[]>(
        `${SLEEPER_BASE_URL}/user/${userId}/leagues/nfl/${season}`,
      ),
    );
    return data;
  }

  async getDraftPicks(draftId: string): Promise<SleeperPick[]> {
    const { data } = await firstValueFrom(
      this.http.get<SleeperPick[]>(
        `${SLEEPER_BASE_URL}/draft/${draftId}/picks`,
      ),
    );
    return data;
  }
}
