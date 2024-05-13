import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './gateway/chat.gateway';
import { ActiveConversationEntity } from './models/active-conversation.entity';
import { ConversationEntity } from './models/conversation.entity';
import { MessageEntity } from './models/message.entity';
import { ConversationService } from './services/conversation.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([
      ConversationEntity,
      ActiveConversationEntity,
      MessageEntity,
    ]),
  ],
  providers: [ChatGateway, ConversationService],
})
export class ChatModule {}
