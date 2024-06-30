import { ApiProperty } from '@nestjs/swagger';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class GetAllDiariesDto extends DefaultPaginationDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  userId?: number;
}
