CREATE TYPE "public"."board_type" AS ENUM('whiteboard', 'desmos', 'chart');--> statement-breakpoint
CREATE TYPE "public"."doc_ingest_status" AS ENUM('uploaded', 'processing', 'indexed', 'error');--> statement-breakpoint
CREATE TYPE "public"."doc_kind" AS ENUM('book', 'slides', 'notes', 'paper');--> statement-breakpoint
CREATE TYPE "public"."embedding_model" AS ENUM('text-embedding-3-small', 'text-embedding-3-large');--> statement-breakpoint
CREATE TYPE "public"."mastery_state" AS ENUM('locked', 'unlocked', 'mastered');--> statement-breakpoint
CREATE TYPE "public"."roadmap_status" AS ENUM('draft', 'active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."tutor_session_type" AS ENUM('drona', 'deeptutor');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('private', 'unlisted', 'public');--> statement-breakpoint
CREATE TYPE "public"."workspace_source_kind" AS ENUM('session', 'book', 'document');--> statement-breakpoint
CREATE TYPE "public"."workspace_type" AS ENUM('personal', 'course');--> statement-breakpoint
CREATE TABLE "boards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note_id" uuid NOT NULL,
	"type" "board_type" NOT NULL,
	"title" text,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_chunk_embeddings" (
	"chunk_id" uuid PRIMARY KEY NOT NULL,
	"embedding_1536" vector(1536),
	"model" "embedding_model" DEFAULT 'text-embedding-3-small' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"norm" real
);
--> statement-breakpoint
CREATE TABLE "book_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"tokens" integer,
	"section" text,
	"page_from" integer,
	"page_to" integer,
	"roadmap_topic_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library_book_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"bucket" text NOT NULL,
	"path" text NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text,
	"size_bytes" integer,
	"pages" integer,
	"sha256" text,
	"ingest_status" "doc_ingest_status" DEFAULT 'uploaded' NOT NULL,
	"last_indexed_at" timestamp,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library_books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"isbn" text,
	"description" text,
	"cover_path" text,
	"owner_profile_id" text NOT NULL,
	"visibility" "visibility" DEFAULT 'private' NOT NULL,
	"kind" "doc_kind" DEFAULT 'book' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"owner_profile_id" text NOT NULL,
	"title" text,
	"content" jsonb NOT NULL,
	"mini_drona_enabled" boolean DEFAULT false NOT NULL,
	"roadmap_id" uuid,
	"topic_id" uuid,
	"provenance" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roadmap_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roadmap_id" uuid NOT NULL,
	"index" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"estimated_hours" integer,
	"prereq_topic_ids" uuid[],
	"mastery_state" "mastery_state" DEFAULT 'locked' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roadmaps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid,
	"owner_profile_id" text NOT NULL,
	"title" text NOT NULL,
	"goal" text,
	"total_hours" integer,
	"status" "roadmap_status" DEFAULT 'draft' NOT NULL,
	"visibility" "visibility" DEFAULT 'private' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tutor_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "tutor_session_type" NOT NULL,
	"owner_profile_id" text NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "workspace_books" (
	"workspace_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_books_pkey" PRIMARY KEY("workspace_id","book_id")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "workspace_type" DEFAULT 'personal' NOT NULL,
	"owner_profile_id" text NOT NULL,
	"settings" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_chunk_embeddings" ADD CONSTRAINT "book_chunk_embeddings_chunk_id_book_chunks_id_fk" FOREIGN KEY ("chunk_id") REFERENCES "public"."book_chunks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_chunks" ADD CONSTRAINT "book_chunks_book_id_library_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."library_books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_chunks" ADD CONSTRAINT "book_chunks_file_id_library_book_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."library_book_files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_book_files" ADD CONSTRAINT "library_book_files_book_id_library_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."library_books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmap_topics" ADD CONSTRAINT "roadmap_topics_roadmap_id_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."roadmaps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_books" ADD CONSTRAINT "workspace_books_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_books" ADD CONSTRAINT "workspace_books_book_id_library_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."library_books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "boards_note_idx" ON "boards" USING btree ("note_id");--> statement-breakpoint
CREATE INDEX "boards_type_idx" ON "boards" USING btree ("type");--> statement-breakpoint
CREATE INDEX "embeddings_model_idx" ON "book_chunk_embeddings" USING btree ("model");--> statement-breakpoint
CREATE INDEX "book_chunks_book_idx" ON "book_chunks" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "book_chunks_file_idx" ON "book_chunks" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX "book_chunks_topic_idx" ON "book_chunks" USING btree ("roadmap_topic_id");--> statement-breakpoint
CREATE INDEX "book_files_book_idx" ON "library_book_files" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "book_files_bucket_path_idx" ON "library_book_files" USING btree ("bucket","path");--> statement-breakpoint
CREATE INDEX "book_files_status_idx" ON "library_book_files" USING btree ("ingest_status");--> statement-breakpoint
CREATE INDEX "lib_books_owner_idx" ON "library_books" USING btree ("owner_profile_id");--> statement-breakpoint
CREATE INDEX "lib_books_visibility_idx" ON "library_books" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "lib_books_kind_idx" ON "library_books" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "notes_workspace_idx" ON "notes" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "notes_topic_idx" ON "notes" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "roadmap_topics_roadmap_idx" ON "roadmap_topics" USING btree ("roadmap_id");--> statement-breakpoint
CREATE INDEX "roadmaps_workspace_idx" ON "roadmaps" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "workspaces_owner_idx" ON "workspaces" USING btree ("owner_profile_id");