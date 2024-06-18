import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('diaries')
export class DiaryEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  data: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.diaries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'belong_to_id' })
  user: UserEntity;

  @Column('text', {
    default: {},
    array: true,
    name: 'images',
  })
  images: string[];
}
