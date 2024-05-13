import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { of, Subscription, take, tap } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ActiveConversation } from '../models/active-conversation.interface';
import { Message } from '../models/message.interface';
import { ConversationService } from '../services/conversation.service';
import { UsersService } from '../../users/services/users.service';
import { PayloadToken } from '../../auth/models/token.model';
import { User } from '../../users/entities/user.entity';

@WebSocketGateway({ cors: { origin: ['http://localhost:8100'] } })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private userService: UsersService,
    private conversationService: ConversationService,
  ) {}

  // Note: Runs when server starts - Remove in production
  onModuleInit() {
    this.conversationService
      .removeActiveConversations()
      .pipe(take(1))
      .subscribe();
    this.conversationService.removeMessages().pipe(take(1)).subscribe();
    this.conversationService.removeConversations().pipe(take(1)).subscribe();
  }

  @WebSocketServer()
  server: Server;

  @UseGuards(JwtAuthGuard)
  async handleConnection(socket: Socket, user: PayloadToken) {
    console.log('HANDLE CONNECTION');
    const FoundUser = await this.userService.findUserById(user.id);
    if (!FoundUser) {
      console.log('No USER');
      this.handleDisconnect(socket);
    } else {
      socket.data.user = FoundUser;
      this.getConversations(socket, FoundUser.id);
    }
  }

  getConversations(socket: Socket, userId: number): Subscription {
    return this.conversationService
      .getConversationsWithUsers(userId)
      .subscribe((conversations) => {
        this.server.to(socket.id).emit('conversations', conversations);
      });
  }

  handleDisconnect(socket: Socket) {
    console.log('HANDLE DISCONNECT');
    this.conversationService
      .leaveConversation(socket.id)
      .pipe(take(1))
      .subscribe();
  }

  @SubscribeMessage('createConversation')
  createConversation(socket: Socket, friend: User) {
    this.conversationService
      .createConversation(socket.data.user, friend)
      .pipe(take(1))
      .subscribe(() => {
        this.getConversations(socket, socket.data.user.id);
      });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, newMessage: Message) {
    if (!newMessage.conversation) return of(null);

    const { user } = socket.data;
    newMessage.user = user;

    if (newMessage.conversation.id) {
      this.conversationService
        .createMessage(newMessage)
        .pipe(take(1))
        .subscribe((message: Message) => {
          newMessage.id = message.id;

          this.conversationService
            .getActiveUsers(newMessage.conversation.id)
            .pipe(take(1))
            .subscribe((activeConversations: ActiveConversation[]) => {
              activeConversations.forEach(
                (activeConversation: ActiveConversation) => {
                  this.server
                    .to(activeConversation.socketId)
                    .emit('newMessage', newMessage);
                },
              );
            });
        });
    }
  }

  @SubscribeMessage('joinConversation')
  joinConversation(socket: Socket, friendId: number) {
    this.conversationService
      .joinConversation(friendId, socket.data.user.id, socket.id)
      .pipe(
        tap((activeConversation: ActiveConversation) => {
          this.conversationService
            .getMessages(activeConversation.conversationId)
            .pipe(take(1))
            .subscribe((messages: Message[]) => {
              this.server.to(socket.id).emit('messages', messages);
            });
        }),
      )
      .pipe(take(1))
      .subscribe();
  }

  @SubscribeMessage('leaveConversation')
  leaveConversation(socket: Socket) {
    this.conversationService
      .leaveConversation(socket.id)
      .pipe(take(1))
      .subscribe();
  }
}
