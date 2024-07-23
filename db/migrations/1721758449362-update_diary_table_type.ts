import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDiaryTableType1721758449362 implements MigrationInterface {
  name = 'UpdateDiaryTableType1721758449362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "diaries" RENAME COLUMN "status" TO "type"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "diaries" RENAME COLUMN "type" TO "status"`,
    );
  }
}
