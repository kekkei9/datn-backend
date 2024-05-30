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
    referenceId,
  }: {
    message: string;
    belongTo: { id: number };
    createdBy: { id: number };
    type: NotificationType;
    referenceId: number;
  }) {
    return this.notificationRepository.save({
      message,
      belongTo,
      createdBy,
      type,
      referenceId,
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
