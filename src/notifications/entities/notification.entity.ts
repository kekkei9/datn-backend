import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { IsEnum } from 'class-validator';

export enum NotificationType {
  PRESCRIPTION = 'prescription',
  APPOINTMENT = 'appointment',
  FRIEND = 'add_friend',
  DIARY = 'diary',
}

@Entity('notifications')
export class NotificationEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: false,
  })
  isRead: boolean;

  @Column()
  message: string;

  //represents reference id number ie: appointmentId, diaryId, prescriptionId, ...
  @Column({
    name: 'reference_id',
  })
  referenceId: number;

  @Column({
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ManyToOne(() => UserEntity, (user) => user.createdNotifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'belong_to_id' })
  belongTo: UserEntity;
}
