import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('prescription')
export class PrescriptionEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  data: object;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.createdPrescriptions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.prescriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'belong_to_id' })
  belongTo: UserEntity;

  @Column('text', {
    default: {},
    array: true,
    name: 'image_paths',
  })
  imagePaths: string[];
}
