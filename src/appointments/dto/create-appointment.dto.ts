import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateApppointmentDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly requestUser: UserEntity;

  @ApiProperty()
  @IsNotEmpty()
  readonly confirmUser: UserEntity;

  @ApiProperty({
    enum: AppointmentStatus,
  })
  @IsNotEmpty()
  @IsEnum(AppointmentStatus)
  readonly status: AppointmentStatus;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly beginTimestamp: number;
}

export enum ResponseAppointmentAction {
  RESCHEDULE = 'reschedule',
  ACCEPT = 'accept',
  DECLINE = 'decline',
  COMPLETE = 'complete',
}

export class ResponseAppointmentRequestDto {
  @ApiProperty({
    enum: ResponseAppointmentAction,
  })
  @IsNotEmpty()
  @IsEnum(ResponseAppointmentAction)
  readonly action: ResponseAppointmentAction;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly cancelReason: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly beginTimestamp: number;
}

export class CreateAppointmentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly note: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly beginTimestamp: number;
}

export class UpdateAppointmentDto {
  @ApiProperty()
  @IsEnum(AppointmentStatus)
  readonly status?: AppointmentStatus;

  @ApiProperty()
  @IsNumber()
  readonly beginTimestamp?: number;

  @ApiProperty()
  @IsString()
  readonly cancelReason?: string;

  @ApiProperty()
  readonly requestUser?: UserEntity;

  @ApiProperty()
  readonly confirmUser?: UserEntity;
}
