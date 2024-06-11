import { ApiProperty } from '@nestjs/swagger';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';
import { IsNumber } from 'class-validator';

export class GetAllDiariesDto extends DefaultPaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  userId?: number;
}
