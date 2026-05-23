import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import type { ActivityEventDto } from '../analytics/analytics.types';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/inbox',
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_workspace')
  handleJoinWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { workspaceId: string },
  ) {
    client.join(`workspace_${data.workspaceId}`);
    this.logger.log(
      `Client ${client.id} joined workspace: ${data.workspaceId}`,
    );
    client.emit('joined', { workspaceId: data.workspaceId });
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation_${data.conversationId}`);
    this.logger.log(
      `Client ${client.id} joined conversation: ${data.conversationId}`,
    );
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    client
      .to(`conversation_${data.conversationId}`)
      .emit('typing', {
        conversationId: data.conversationId,
        isTyping: data.isTyping,
      });
  }

  emitNewMessage(
    workspaceId: string,
    conversationId: string,
    message: any,
  ) {
    this.server
      .to(`workspace_${workspaceId}`)
      .emit('new_message', { conversationId, message });

    this.server
      .to(`conversation_${conversationId}`)
      .emit('new_message', { conversationId, message });

    this.logger.log(`Emitted new_message to workspace: ${workspaceId}`);
  }

  emitConversationUpdate(workspaceId: string, conversation: any) {
    this.server
      .to(`workspace_${workspaceId}`)
      .emit('conversation_updated', conversation);
  }

  /**
   * Broadcast an AI typing indicator to all clients watching a conversation.
   * @param conversationId  the room to target
   * @param isTyping        true = AI is composing, false = done
   */
  emitAiTyping(conversationId: string, isTyping: boolean) {
    this.server
      .to(`conversation_${conversationId}`)
      .emit('ai_typing', { conversationId, isTyping });
    this.logger.log(
      `Emitted ai_typing(${isTyping}) to conversation: ${conversationId}`,
    );
  }

  /** Real-time activity for analytics dashboard & notification center */
  emitActivityEvent(workspaceId: string, event: ActivityEventDto) {
    this.server
      .to(`workspace_${workspaceId}`)
      .emit('activity_event', event);
    this.logger.log(`Emitted activity_event (${event.type}) workspace=${workspaceId}`);
  }
}
