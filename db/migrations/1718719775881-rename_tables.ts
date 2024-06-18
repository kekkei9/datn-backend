import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTables1718719775881 implements MigrationInterface {
  name = 'RenameTables1718719775881';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "diagnoses" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "problem" character varying NOT NULL, "images" text array NOT NULL DEFAULT '{}', "prescription_id" integer, CONSTRAINT "PK_d1bfabf423f99c537817e6ad244" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "prescriptions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "data" jsonb NOT NULL, "images" text array NOT NULL DEFAULT '{}', "created_by_id" integer, "belong_to_id" integer, "appointment_id" integer, CONSTRAINT "REL_94491da15bc982f3435690fc96" UNIQUE ("appointment_id"), CONSTRAINT "PK_097b2cc2f2b7e56825468188503" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "appointments" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "begin_timestamp" integer NOT NULL, "request_user_id" integer, "confirm_user_id" integer, "prescription_id" integer, CONSTRAINT "REL_43c2d03db22b5018ccecd4b880" UNIQUE ("prescription_id"), CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "diaries" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "data" jsonb NOT NULL, "images" text array NOT NULL DEFAULT '{}', "belong_to_id" integer, CONSTRAINT "PK_ffd738e7d40dcfa59283dcaae87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "isRead" boolean NOT NULL DEFAULT false, "message" character varying NOT NULL, "reference_id" integer NOT NULL, "type" character varying NOT NULL, "created_by_id" integer, "belong_to_id" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reports" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reason" character varying NOT NULL, "created_by_id" integer, "belong_to_id" integer, CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "doctor_requests" ("id" SERIAL NOT NULL, "metadata" jsonb, "request_user_id" integer, "confirm_user_id" integer, CONSTRAINT "REL_a5385e1e0618e577a5672e2892" UNIQUE ("request_user_id"), CONSTRAINT "PK_74fc746edd7142e7de0154e7f42" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "friend_requests" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "pin_id" character varying, "creator_id" integer, "receiver_id" integer, CONSTRAINT "PK_3827ba86ce64ecb4b90c92eeea6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnoses" ADD CONSTRAINT "FK_fa77352d862d1d498424c939f10" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescriptions" ADD CONSTRAINT "FK_3889a6706b0b302803f8e5aa4ca" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescriptions" ADD CONSTRAINT "FK_5c33f2de5faf0209ec5a3a62460" FOREIGN KEY ("belong_to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescriptions" ADD CONSTRAINT "FK_94491da15bc982f3435690fc96e" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_713406cfb61e9d652f80dfed361" FOREIGN KEY ("request_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_43f69fae811e1e13eb2206096e9" FOREIGN KEY ("confirm_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_43c2d03db22b5018ccecd4b8803" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diaries" ADD CONSTRAINT "FK_5d90165b2d98fb27ac2653a8033" FOREIGN KEY ("belong_to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_8abe9303bccd29799a4d435eb03" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_456dd68afc7471e21c4c5d04d24" FOREIGN KEY ("belong_to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_aa22cb05e1746224f2bc3345e6e" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_7f7425e8746ea0c761a48e344bf" FOREIGN KEY ("belong_to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" ADD CONSTRAINT "FK_a5385e1e0618e577a5672e28926" FOREIGN KEY ("request_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" ADD CONSTRAINT "FK_e385ad103c94ce5b9b79a2a0b14" FOREIGN KEY ("confirm_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_5d0c4319dbad0939437e81245b1" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_781744f1014838837741581a8b7" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_781744f1014838837741581a8b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_5d0c4319dbad0939437e81245b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" DROP CONSTRAINT "FK_e385ad103c94ce5b9b79a2a0b14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_requests" DROP CONSTRAINT "FK_a5385e1e0618e577a5672e28926"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_7f7425e8746ea0c761a48e344bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_aa22cb05e1746224f2bc3345e6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_456dd68afc7471e21c4c5d04d24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_8abe9303bccd29799a4d435eb03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diaries" DROP CONSTRAINT "FK_5d90165b2d98fb27ac2653a8033"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_43c2d03db22b5018ccecd4b8803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_43f69fae811e1e13eb2206096e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_713406cfb61e9d652f80dfed361"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescriptions" DROP CONSTRAINT "FK_94491da15bc982f3435690fc96e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescriptions" DROP CONSTRAINT "FK_5c33f2de5faf0209ec5a3a62460"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescriptions" DROP CONSTRAINT "FK_3889a6706b0b302803f8e5aa4ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnoses" DROP CONSTRAINT "FK_fa77352d862d1d498424c939f10"`,
    );
    await queryRunner.query(`DROP TABLE "friend_requests"`);
    await queryRunner.query(`DROP TABLE "doctor_requests"`);
    await queryRunner.query(`DROP TABLE "reports"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "diaries"`);
    await queryRunner.query(`DROP TABLE "appointments"`);
    await queryRunner.query(`DROP TABLE "prescriptions"`);
    await queryRunner.query(`DROP TABLE "diagnoses"`);
  }
}