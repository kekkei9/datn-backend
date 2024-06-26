import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';

export class GetAllDiagnoses extends DefaultPaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  userId?: number;
}
