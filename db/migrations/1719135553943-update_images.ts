import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateImages1719135553943 implements MigrationInterface {
  name = 'UpdateImages1719135553943';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" ADD "idCardFront" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" ADD "idCardBack" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" ADD "images" text array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" DROP COLUMN "images"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" DROP COLUMN "idCardBack"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" DROP COLUMN "idCardFront"`,
    );
  }
}
