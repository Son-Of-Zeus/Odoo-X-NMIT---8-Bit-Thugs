-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "jwt_token" VARCHAR(256),
ADD COLUMN     "refresh_token" VARCHAR(256);
