import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostRefactor1718105295550 implements MigrationInterface {
  name = 'PostRefactor1718105295550';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "begin_timestamp" integer NOT NULL, "request_user_id" integer, "confirm_user_id" integer, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "diary" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "data" jsonb NOT NULL, "image_paths" text array NOT NULL DEFAULT '{}', "created_by_id" integer, "belong_to_id" integer, CONSTRAINT "PK_7422c55a0908c4271ff1918437d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "isRead" boolean NOT NULL DEFAULT false, "message" character varying NOT NULL, "reference_id" integer NOT NULL, "type" character varying NOT NULL, "created_by_id" integer, "belong_to_id" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "diagnose" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "problem" character varying NOT NULL, "image_paths" text array NOT NULL DEFAULT '{}', "prescription_id" integer, CONSTRAINT "PK_18333da5c8a75af7f1609fce544" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "prescription" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "data" jsonb NOT NULL, "image_paths" text array NOT NULL DEFAULT '{}', "created_by_id" integer, "belong_to_id" integer, CONSTRAINT "PK_eaba5e4414e5382781e08467b51" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "report" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reason" character varying NOT NULL, "created_by_id" integer, "belong_to_id" integer, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "doctor_request" ("id" SERIAL NOT NULL, "metadata" jsonb, "request_user_id" integer, "confirm_user_id" integer, CONSTRAINT "REL_b585286593852eff11948cf037" UNIQUE ("request_user_id"), CONSTRAINT "PK_29f198a36455aa599734e85f7b5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "friend_request" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "pin_id" character varying, "creator_id" integer, "receiver_id" integer, CONSTRAINT "PK_4c9d23ff394888750cf66cac17c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying, "phone_number" character varying NOT NULL, "password" character varying NOT NULL, "deactivated" boolean NOT NULL DEFAULT false, "refresh_token" character varying, "avatar" character varying, "gender" character varying, "birthdate" TIMESTAMP, "address" character varying, "height" integer, "weight" integer, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'patient', CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_8067b187469db3b5ff5a60e4820" FOREIGN KEY ("request_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_29aa3a7065ea978d967c57b0df8" FOREIGN KEY ("confirm_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diary" ADD CONSTRAINT "FK_2db7d78424cec4801557076efc9" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diary" ADD CONSTRAINT "FK_c04f68e4503777aed89983ab928" FOREIGN KEY ("belong_to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_b24e9ebaf4411c8b9b1917e391b" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_d7b9a83220a1a1f35eb439554c0" FOREIGN KEY ("belong_to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnose" ADD CONSTRAINT "FK_ff2a9c1873f3f05e7f795b99ce3" FOREIGN KEY ("prescription_id") REFERENCES "prescription"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescription" ADD CONSTRAINT "FK_725aa43f0acb1b221e5eccd45ee" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescription" ADD CONSTRAINT "FK_c6dddfb9b8dbcf3df93a06c4d49" FOREIGN KEY ("belong_to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_d2b99879f78e80001b7e50fcd68" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_c882a15a13fe154de0656686f28" FOREIGN KEY ("belong_to_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_request" ADD CONSTRAINT "FK_b585286593852eff11948cf0375" FOREIGN KEY ("request_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_request" ADD CONSTRAINT "FK_035d63c86f3996b6655f3ce2444" FOREIGN KEY ("confirm_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "FK_34376d491f2c8860bf08c1d5b63" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "FK_6f327bd90aba348e276d42ecf22" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "FK_6f327bd90aba348e276d42ecf22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "FK_34376d491f2c8860bf08c1d5b63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_request" DROP CONSTRAINT "FK_035d63c86f3996b6655f3ce2444"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_request" DROP CONSTRAINT "FK_b585286593852eff11948cf0375"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" DROP CONSTRAINT "FK_c882a15a13fe154de0656686f28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" DROP CONSTRAINT "FK_d2b99879f78e80001b7e50fcd68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescription" DROP CONSTRAINT "FK_c6dddfb9b8dbcf3df93a06c4d49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescription" DROP CONSTRAINT "FK_725aa43f0acb1b221e5eccd45ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diagnose" DROP CONSTRAINT "FK_ff2a9c1873f3f05e7f795b99ce3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_d7b9a83220a1a1f35eb439554c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_b24e9ebaf4411c8b9b1917e391b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diary" DROP CONSTRAINT "FK_c04f68e4503777aed89983ab928"`,
    );
    await queryRunner.query(
      `ALTER TABLE "diary" DROP CONSTRAINT "FK_2db7d78424cec4801557076efc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_29aa3a7065ea978d967c57b0df8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_8067b187469db3b5ff5a60e4820"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "friend_request"`);
    await queryRunner.query(`DROP TABLE "doctor_request"`);
    await queryRunner.query(`DROP TABLE "report"`);
    await queryRunner.query(`DROP TABLE "prescription"`);
    await queryRunner.query(`DROP TABLE "diagnose"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "diary"`);
    await queryRunner.query(`DROP TABLE "appointment"`);
  }
}
