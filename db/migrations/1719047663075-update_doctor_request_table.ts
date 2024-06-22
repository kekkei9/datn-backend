import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDoctorRequestTable1719047663075
  implements MigrationInterface
{
  name = 'UpdateDoctorRequestTable1719047663075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" ADD "specialties" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "metadata" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "metadata"`);
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" DROP COLUMN "specialties"`,
    );
  }
}
