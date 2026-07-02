import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { LeaguesService } from './leagues.service';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @UseGuards(JwtGuard)
  @Get()
  getLeagues(@Request() req: { user: { sub: string } }) {
    return this.leaguesService.syncAndFetch(req.user.sub);
  }
}
