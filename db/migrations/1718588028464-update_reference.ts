import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateReference1718588028464 implements MigrationInterface {
  name = 'UpdateReference1718588028464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prescription" ADD "appointment_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescription" ADD CONSTRAINT "UQ_a85c7db04d004b2236525bed06e" UNIQUE ("appointment_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD "prescription_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "UQ_80ab389269d3ab9bf51268465ab" UNIQUE ("prescription_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescription" ADD CONSTRAINT "FK_a85c7db04d004b2236525bed06e" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_80ab389269d3ab9bf51268465ab" FOREIGN KEY ("prescription_id") REFERENCES "prescription"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_80ab389269d3ab9bf51268465ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescription" DROP CONSTRAINT "FK_a85c7db04d004b2236525bed06e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "UQ_80ab389269d3ab9bf51268465ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP COLUMN "prescription_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescription" DROP CONSTRAINT "UQ_a85c7db04d004b2236525bed06e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescription" DROP COLUMN "appointment_id"`,
    );
  }
}
