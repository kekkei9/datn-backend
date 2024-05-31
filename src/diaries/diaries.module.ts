import { Module, forwardRef } from '@nestjs/common';
import { DiariesController } from './controllers/diaries.controller';
import { DiariesService } from './services/diaries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from './entities/diary.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    NotificationsModule,
    TypeOrmModule.forFeature([DiaryEntity]),
    forwardRef(() => UsersModule),
    ImageModule,
  ],
  controllers: [DiariesController],
  providers: [DiariesService],
  exports: [DiariesService],
})
export class DiariesModule {}
