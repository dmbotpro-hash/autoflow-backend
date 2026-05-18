/**
 * FILE: messages.gateway.ts
 * PURPOSE: Websocket gateway for real-time message updates to the dashboard inbox
 * 
 * DEPENDENCIES:
 * - NestJS WebSocket gateway
 * - Socket.io server (or nestjs ws)
 * - MessagesService (shell)
 * 
 * EXPORTS:
 * - MessagesGateway class
 * 
 * NEXT SESSION INSTRUCTION:
 * - Implement websocket events for new messages and conversation updates.
 */

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
      .emit('typing', { isTyping: data.isTyping });
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
    this.server.to(`workspace_${workspaceId}`).emit('conversation_updated', conversation);
  }
}


