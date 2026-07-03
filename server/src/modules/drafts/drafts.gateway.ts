import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DraftPollerService, RelayedPick } from './draft-poller.service';

interface JoinDraftPayload {
  draftId: string;
}

@WebSocketGateway({
  namespace: '/drafts',
  cors: { origin: '*' },
})
export class DraftsGateway implements OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  private readonly logger = new Logger(DraftsGateway.name);
  private readonly socketDrafts = new Map<string, Set<string>>();

  constructor(private readonly draftPoller: DraftPollerService) {}

  @SubscribeMessage('joinDraft')
  handleJoinDraft(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinDraftPayload,
  ): void {
    const draftId = payload?.draftId;
    if (!draftId) return;

    const joined = this.socketDrafts.get(client.id) ?? new Set<string>();
    if (joined.has(draftId)) return;
    joined.add(draftId);
    this.socketDrafts.set(client.id, joined);

    void client.join(draftId);
    this.logger.log(`Client ${client.id} joined draft ${draftId}`);

    this.draftPoller.subscribe(draftId, (picks: RelayedPick[]) => {
      this.server.to(draftId).emit('picks', picks);
    });
  }

  @SubscribeMessage('leaveDraft')
  handleLeaveDraft(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinDraftPayload,
  ): void {
    if (!payload?.draftId) return;
    this.leaveDraft(client, payload.draftId);
  }

  handleDisconnect(client: Socket): void {
    const draftIds = this.socketDrafts.get(client.id);
    if (!draftIds) return;
    for (const draftId of draftIds) {
      this.draftPoller.unsubscribe(draftId);
    }
    this.socketDrafts.delete(client.id);
  }

  private leaveDraft(client: Socket, draftId: string): void {
    const joined = this.socketDrafts.get(client.id);
    if (!joined?.has(draftId)) return;
    joined.delete(draftId);
    void client.leave(draftId);
    this.draftPoller.unsubscribe(draftId);
  }
}
