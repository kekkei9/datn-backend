import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAppointmentTable1721754633367 implements MigrationInterface {
  name = 'UpdateAppointmentTable1721754633367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "note" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "cancelReason" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "cancelReason"`,
    );
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "note"`);
  }
}
