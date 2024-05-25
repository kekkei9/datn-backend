import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FriendRequest_Status } from './friend-request.interface';

import { UserEntity as UserEntity } from './user.entity';

@Entity('request')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentFriendRequests)
  creator: UserEntity;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.receivedFriendRequests,
  )
  receiver: UserEntity;

  @Column()
  status: FriendRequest_Status;

  @Column({
    nullable: true,
  })
  pinId: FriendRequest_Status;
}
