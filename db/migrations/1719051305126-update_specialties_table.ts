import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSpecialtiesTable1719051305126 implements MigrationInterface {
  name = 'UpdateSpecialtiesTable1719051305126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_specialties_doctor_requests" ("usersId" integer NOT NULL, "doctorRequestsId" integer NOT NULL, CONSTRAINT "PK_6396bcfe2d9673ecaa642db6edb" PRIMARY KEY ("usersId", "doctorRequestsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bf4bbec9b2e79084ac2ca39152" ON "users_specialties_doctor_requests" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9c3b177fc695ef998f4576dd11" ON "users_specialties_doctor_requests" ("doctorRequestsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" ADD "isDone" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_specialties_doctor_requests" ADD CONSTRAINT "FK_bf4bbec9b2e79084ac2ca391526" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_specialties_doctor_requests" ADD CONSTRAINT "FK_9c3b177fc695ef998f4576dd114" FOREIGN KEY ("doctorRequestsId") REFERENCES "doctor_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_specialties_doctor_requests" DROP CONSTRAINT "FK_9c3b177fc695ef998f4576dd114"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_specialties_doctor_requests" DROP CONSTRAINT "FK_bf4bbec9b2e79084ac2ca391526"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" DROP COLUMN "isDone"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9c3b177fc695ef998f4576dd11"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bf4bbec9b2e79084ac2ca39152"`,
    );
    await queryRunner.query(`DROP TABLE "users_specialties_doctor_requests"`);
  }
}
