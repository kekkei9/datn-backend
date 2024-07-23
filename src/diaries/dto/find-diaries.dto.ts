import { ApiProperty } from '@nestjs/swagger';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { DiaryType } from '../entities/diary.entity';

export class GetAllDiariesDto extends DefaultPaginationDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsEnum(DiaryType)
  @IsOptional()
  type?: DiaryType;
}
