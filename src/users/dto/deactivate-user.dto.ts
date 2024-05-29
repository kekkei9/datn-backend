import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class DeactivateUserDto {
  @ApiProperty()
  @IsBoolean()
  deactivated: boolean;
}
