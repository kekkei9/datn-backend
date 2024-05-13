import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateApppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly requestUser: User;

  @ApiProperty()
  @IsNotEmpty()
  readonly confirmUser: User;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly status: 'ongoing' | 'declined' | 'completed';

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly beginTimestamp: number;
}
