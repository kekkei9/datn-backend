import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { PayloadToken } from '../../auth/models/token.model';

export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  create({ message }: CreateNotificationDto, user: PayloadToken) {
    return this.notificationRepository.save({
      message,
      user: { id: user.id },
    });
  }
}
