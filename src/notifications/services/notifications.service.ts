import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayloadToken } from '../../auth/models/token.model';
import {
  NotificationEntity,
  NotificationType,
} from '../entities/notification.entity';

export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  create({
    message,
    belongTo,
    createdBy,
    type,
  }: {
    message: string;
    belongTo: PayloadToken;
    createdBy: PayloadToken;
    type: NotificationType;
  }) {
    return this.notificationRepository.save({
      message,
      belongTo,
      createdBy,
      type,
    });
  }

  getUserNotifications(user: PayloadToken) {
    return this.notificationRepository.find({
      where: { belongTo: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  markNotificationAsRead(id: number) {
    return this.notificationRepository.update(id, { isRead: true });
  }

  getAllNotifications() {
    return this.notificationRepository.find();
  }
}
