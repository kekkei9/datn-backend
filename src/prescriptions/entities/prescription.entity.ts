import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('prescription')
export class PrescriptionEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  data: object;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.createdPrescriptions)
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.prescriptions)
  belongTo: UserEntity;
}
