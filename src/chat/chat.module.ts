import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ChatGateway } from './gateway/chat.gateway';
import { ActiveConversationEntity } from './models/active-conversation.entity';
import { ConversationEntity } from './models/conversation.entity';
import { MessageEntity } from './models/message.entity';
import { ConversationService } from './services/conversation.service';
import { UsersService } from 'src/users/services/users.service';

@Module({
  imports: [
    UsersService,
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
