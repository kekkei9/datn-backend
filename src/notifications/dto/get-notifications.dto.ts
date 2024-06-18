import { ApiProperty } from '@nestjs/swagger';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';
import { NotificationType } from '../entities/notification.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class GetNotificationsDto extends DefaultPaginationDto {
  @IsOptional()
  @ApiProperty({ required: false, enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;
}
