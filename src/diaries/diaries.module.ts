import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from '../image/image.module';
import { UsersModule } from '../users/users.module';
import { DiariesController } from './controllers/diaries.controller';
import { DiaryEntity } from './entities/diary.entity';
import { DiariesService } from './services/diaries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity]),
    forwardRef(() => UsersModule),
    ImageModule,
  ],
  controllers: [DiariesController],
  providers: [DiariesService],
  exports: [DiariesService],
})
export class DiariesModule {}
