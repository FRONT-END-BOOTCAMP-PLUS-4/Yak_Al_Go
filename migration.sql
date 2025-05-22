-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "is_accepted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "qnaId" INTEGER NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "healths" (
    "id" SERIAL NOT NULL,
    "health_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "healths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "itemSeq" TEXT NOT NULL,
    "hpid" TEXT NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medi_times" (
    "id" SERIAL NOT NULL,
    "medi_time" INTEGER NOT NULL,
    "userMediId" INTEGER NOT NULL,

    CONSTRAINT "medi_times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicines" (
    "item_seq" TEXT NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "entp_name" VARCHAR(255),
    "item_permit_date" TIMESTAMP(3),
    "etc_otc_code" VARCHAR(50),
    "class_no" VARCHAR(100),
    "chart" TEXT,
    "bar_code" VARCHAR(50),
    "material_name" TEXT,
    "storage_method" VARCHAR(255),
    "valid_term" VARCHAR(100),
    "type_code" VARCHAR(10),
    "type_name" VARCHAR(100),
    "ee_doc_id" VARCHAR(255),
    "ud_doc_id" VARCHAR(255),
    "nb_doc_id" VARCHAR(255),
    "insert_file" VARCHAR(255),
    "cancel_name" VARCHAR(100),
    "reexam_target" VARCHAR(255),
    "reexam_date" TIMESTAMP(3),
    "pack_unit" VARCHAR(255),
    "edi_code" VARCHAR(50),
    "cancel_date" TIMESTAMP(3),
    "change_date" TIMESTAMP(3),
    "bizrno" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("item_seq")
);

-- CreateTable
CREATE TABLE "pharmacies" (
    "hpid" TEXT NOT NULL,
    "duty_addr" VARCHAR(255),
    "duty_mapimg" VARCHAR(255),
    "duty_name" VARCHAR(255) NOT NULL,
    "duty_tel1" VARCHAR(50),
    "duty_time1c" VARCHAR(10),
    "duty_time1s" VARCHAR(10),
    "duty_time2c" VARCHAR(10),
    "duty_time2s" VARCHAR(10),
    "duty_time3c" VARCHAR(10),
    "duty_time3s" VARCHAR(10),
    "duty_time4c" VARCHAR(10),
    "duty_time4s" VARCHAR(10),
    "duty_time5c" VARCHAR(10),
    "duty_time5s" VARCHAR(10),
    "duty_time6c" VARCHAR(10),
    "duty_time6s" VARCHAR(10),
    "duty_time7c" VARCHAR(10),
    "duty_time7s" VARCHAR(10),
    "post_cdn1" VARCHAR(10),
    "post_cdn2" VARCHAR(10),
    "wgs84_lat" DECIMAL(10,7),
    "wgs84_lon" DECIMAL(10,7),

    CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("hpid")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "id" SERIAL NOT NULL,
    "tagId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qna_tags" (
    "id" SERIAL NOT NULL,
    "tagId" INTEGER NOT NULL,
    "qnaId" INTEGER NOT NULL,

    CONSTRAINT "qna_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qnas" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "qnas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "tag_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_healths" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "healthId" INTEGER NOT NULL,

    CONSTRAINT "user_healths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_medis" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "itemSeq" TEXT NOT NULL,

    CONSTRAINT "user_medis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255),
    "photo" VARCHAR(255),
    "name" VARCHAR(100),
    "birthyear" INTEGER,
    "gender" VARCHAR(10),
    "member_type" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "hpid" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medicines_item_name_idx" ON "medicines"("item_name");

-- CreateIndex
CREATE INDEX "medicines_entp_name_idx" ON "medicines"("entp_name");

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_qnaId_fkey" FOREIGN KEY ("qnaId") REFERENCES "qnas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_hpid_fkey" FOREIGN KEY ("hpid") REFERENCES "pharmacies"("hpid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_itemSeq_fkey" FOREIGN KEY ("itemSeq") REFERENCES "medicines"("item_seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medi_times" ADD CONSTRAINT "medi_times_userMediId_fkey" FOREIGN KEY ("userMediId") REFERENCES "user_medis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qna_tags" ADD CONSTRAINT "qna_tags_qnaId_fkey" FOREIGN KEY ("qnaId") REFERENCES "qnas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qna_tags" ADD CONSTRAINT "qna_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qnas" ADD CONSTRAINT "qnas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_healths" ADD CONSTRAINT "user_healths_healthId_fkey" FOREIGN KEY ("healthId") REFERENCES "healths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_healths" ADD CONSTRAINT "user_healths_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_medis" ADD CONSTRAINT "user_medis_itemSeq_fkey" FOREIGN KEY ("itemSeq") REFERENCES "medicines"("item_seq") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_medis" ADD CONSTRAINT "user_medis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_hpid_fkey" FOREIGN KEY ("hpid") REFERENCES "pharmacies"("hpid") ON DELETE SET NULL ON UPDATE CASCADE;

