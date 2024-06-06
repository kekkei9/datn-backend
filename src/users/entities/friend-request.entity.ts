import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendRequestStatus } from './friend-request.interface';

import { UserEntity as UserEntity } from './user.entity';

@Entity('friend_request')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentFriendRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id' })
  creator: UserEntity;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.receivedFriendRequests,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @Column()
  status: FriendRequestStatus;

  @Column({
    nullable: true,
    name: 'pin_id',
  })
  pinId: string;
}
