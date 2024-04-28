import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { DoctorRequestEntity } from './entities/doctor-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FriendRequestEntity, DoctorRequestEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
