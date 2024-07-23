import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsJSON } from 'class-validator';
import { DiaryType } from '../entities/diary.entity';

export class CreateDiaryDto {
  @ApiProperty()
  @IsJSON()
  data: string;

  @ApiProperty()
  @IsEnum(DiaryType)
  type: DiaryType;
}
