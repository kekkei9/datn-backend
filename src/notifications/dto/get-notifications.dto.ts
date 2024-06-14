import { ApiProperty } from '@nestjs/swagger';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';
import { NotificationType } from '../entities/notification.entity';
import { IsEnum } from 'class-validator';

export class GetNotificationsDto extends DefaultPaginationDto {
  @ApiProperty({ required: false, enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;
}
