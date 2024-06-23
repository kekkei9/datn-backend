import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDoctorRegister1719137274665 implements MigrationInterface {
  name = 'UpdateDoctorRegister1719137274665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" DROP CONSTRAINT "FK_a5385e1e0618e577a5672e28926"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" DROP CONSTRAINT "REL_a5385e1e0618e577a5672e2892"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" ADD CONSTRAINT "FK_a5385e1e0618e577a5672e28926" FOREIGN KEY ("request_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" DROP CONSTRAINT "FK_a5385e1e0618e577a5672e28926"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" ADD CONSTRAINT "REL_a5385e1e0618e577a5672e2892" UNIQUE ("request_user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" ADD CONSTRAINT "FK_a5385e1e0618e577a5672e28926" FOREIGN KEY ("request_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
