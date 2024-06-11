import { PrescriptionEntity } from '../entities/prescription.entity';

export const prescriptionMapper = (prescription: PrescriptionEntity) => ({
  ...prescription,
  data: JSON.parse(prescription.data),
});
