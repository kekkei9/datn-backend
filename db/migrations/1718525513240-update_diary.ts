import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDiary1718525513240 implements MigrationInterface {
  name = 'UpdateDiary1718525513240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "diary" DROP CONSTRAINT "FK_2db7d78424cec4801557076efc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnose" RENAME COLUMN "image_paths" TO "images"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescription" RENAME COLUMN "image_paths" TO "images"`,
    );
    await queryRunner.query(`ALTER TABLE "diary" DROP COLUMN "image_paths"`);
    await queryRunner.query(`ALTER TABLE "diary" DROP COLUMN "created_by_id"`);
    await queryRunner.query(
      `ALTER TABLE "diary" ADD "images" text array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "diary" DROP COLUMN "images"`);
    await queryRunner.query(`ALTER TABLE "diary" ADD "created_by_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "diary" ADD "image_paths" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescription" RENAME COLUMN "images" TO "image_paths"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnose" RENAME COLUMN "images" TO "image_paths"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diary" ADD CONSTRAINT "FK_2db7d78424cec4801557076efc9" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
