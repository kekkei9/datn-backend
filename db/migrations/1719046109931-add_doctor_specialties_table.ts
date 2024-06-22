import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDoctorSpecialtiesTable1719046109931
  implements MigrationInterface
{
  name = 'AddDoctorSpecialtiesTable1719046109931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "doctor_specialties" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "label" character varying NOT NULL, CONSTRAINT "PK_28e3c8a89299955a87ece809dbe" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "doctor_specialties"`);
  }
}
