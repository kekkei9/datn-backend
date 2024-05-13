import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersController } from './controllers/users.controller';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { DoctorRequestEntity } from './entities/doctor-request.entity';
import { ConversationEntity } from '../chat/models/conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FriendRequestEntity,
      DoctorRequestEntity,
      ConversationEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
