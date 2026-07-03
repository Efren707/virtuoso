import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { DraftPollerService } from './draft-poller.service';

@Controller('drafts')
export class DraftsController {
  constructor(private readonly draftPoller: DraftPollerService) {}

  @UseGuards(JwtGuard)
  @Get(':draftId/picks')
  getPicks(@Param('draftId') draftId: string) {
    return this.draftPoller.getPicks(draftId);
  }
}
