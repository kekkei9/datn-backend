import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateApppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly requestUser: User;

  @ApiProperty()
  @IsNotEmpty()
  readonly confirmUser: User;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(['pending', 'ongoing', 'declined', 'completed'])
  readonly status: 'pending' | 'ongoing' | 'declined' | 'completed';

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly beginTimestamp: number;
}

export class ResponseAppointmentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(['RESCHEDULE', 'ACCEPT', 'DECLINE', 'COMPLETE'])
  readonly action: 'RESCHEDULE' | 'ACCEPT' | 'DECLINE' | 'COMPLETE';

  @ApiProperty()
  @IsNumber()
  readonly beginTimestamp: number;
}

export class CreateAppointmentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly beginTimestamp: number;
}

export class UpdateAppointmentDto {
  @ApiProperty()
  @IsString()
  readonly status?: 'pending' | 'ongoing' | 'declined' | 'completed';

  @ApiProperty()
  @IsNumber()
  readonly beginTimestamp?: number;

  @ApiProperty()
  readonly requestUser?: User;

  @ApiProperty()
  readonly confirmUser?: User;
}
