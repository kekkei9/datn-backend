import { Module, forwardRef } from '@nestjs/common';
import { DiariesController } from './controllers/diaries.controller';
import { DiariesService } from './services/diaries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from './entities/diary.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity]),
    forwardRef(() => UsersModule),
  ],
  controllers: [DiariesController],
  providers: [DiariesService],
  exports: [DiariesService],
})
export class DiariesModule {}
