import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';

export class GetAllPrescriptionDto extends DefaultPaginationDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  userId?: number;
}
