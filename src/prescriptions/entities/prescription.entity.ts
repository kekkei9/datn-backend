import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { DiagnoseEntity } from './diagnose.entity';

@Entity('prescription')
export class PrescriptionEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  data: string;

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

  @OneToMany(
    () => DiagnoseEntity,
    (diagnoseEntity) => diagnoseEntity.prescription,
  )
  diagnoses: DiagnoseEntity[];

  @Column('text', {
    default: {},
    array: true,
    name: 'images',
  })
  images: string[];
}
