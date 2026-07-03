import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from '../../entities/league.entity';
import { Player } from '../../entities/player.entity';
import { DraftPick } from '../../entities/draft-pick.entity';
import { SleeperModule } from '../sleeper/sleeper.module';
import { DraftPollerService } from './draft-poller.service';
import { DraftsGateway } from './drafts.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([League, Player, DraftPick]),
    SleeperModule,
  ],
  providers: [DraftPollerService, DraftsGateway],
})
export class DraftsModule {}
