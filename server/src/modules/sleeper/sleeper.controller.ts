import { Controller, Get, Param } from '@nestjs/common';
import { SleeperService } from './sleeper.service';

@Controller('sleeper')
export class SleeperController {
  constructor(private readonly sleeperService: SleeperService) {}

  @Get('users/:username')
  getUser(@Param('username') username: string) {
    return this.sleeperService.getUser(username);
  }

  @Get('users/:userId/leagues/:season')
  getLeaguesForUser(
    @Param('userId') userId: string,
    @Param('season') season: string,
  ) {
    return this.sleeperService.getLeaguesForUser(userId, season);
  }
}
