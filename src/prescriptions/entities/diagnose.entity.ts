import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { PrescriptionEntity } from './prescription.entity';

@Entity('diagnose')
export class DiagnoseEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  problem: string;

  @ManyToOne(
    () => PrescriptionEntity,
    (prescriptionEntity) => prescriptionEntity.diagnoses,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'prescription_id' })
  prescription: PrescriptionEntity;

  @Column('text', {
    default: {},
    array: true,
    name: 'image_paths',
  })
  imagePaths: string[];
}
