import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1792206389688 implements MigrationInterface {
    name = 'InitSchema1792206389688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
            CREATE TABLE "admins" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying(255) NOT NULL,
                "password_hash" character varying(255) NOT NULL,
                "name" character varying(255) NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"),
                CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."event_impact_enum" AS ENUM('positive', 'negative')
        `);
        await queryRunner.query(`
            CREATE TABLE "events" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "date" date NOT NULL,
                "impact" "public"."event_impact_enum" NOT NULL,
                "description" text,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_217a680273e6f360857e9c5326" ON "events" ("date")
        `);
        await queryRunner.query(`
            CREATE TABLE "daily_metrics" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "date" date NOT NULL,
                "pos_revenue" numeric(12, 2) DEFAULT '0',
                "eatclub_revenue" numeric(12, 2) DEFAULT '0',
                "labour_cost" numeric(12, 2) DEFAULT '0',
                "covers" integer DEFAULT '0',
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                CONSTRAINT "UQ_c3014622c8afe6395973b399e68" UNIQUE ("date"),
                CONSTRAINT "CHK_daily_metrics_non_negative" CHECK (
                    pos_revenue >= 0
                    AND eatclub_revenue >= 0
                    AND labour_cost >= 0
                    AND covers >= 0
                ),
                CONSTRAINT "PK_0b33a3faffa5fbb3d4dad78c4e9" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "daily_metrics"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_217a680273e6f360857e9c5326"
        `);
        await queryRunner.query(`
            DROP TABLE "events"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."event_impact_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "admins"
        `);
    }

}
