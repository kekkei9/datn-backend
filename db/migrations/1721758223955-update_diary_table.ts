import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDiaryTable1721758223955 implements MigrationInterface {
  name = 'UpdateDiaryTable1721758223955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "diaries" ADD "status" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "diaries" DROP COLUMN "status"`);
  }
}
