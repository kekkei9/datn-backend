import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';

export class CreateApppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly requestUser: UserEntity;

  @ApiProperty()
  @IsNotEmpty()
  readonly confirmUser: UserEntity;

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
  @IsOptional()
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
  readonly requestUser?: UserEntity;

  @ApiProperty()
  readonly confirmUser?: UserEntity;
}
