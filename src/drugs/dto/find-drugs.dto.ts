import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';

export class GetAllDrugsDto extends DefaultPaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  filterAll: string;
}
