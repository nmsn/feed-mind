CREATE TABLE IF NOT EXISTS "ai_annotations" (
	"id" text PRIMARY KEY NOT NULL,
	"reading_item_id" text NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articles" (
	"id" text PRIMARY KEY NOT NULL,
	"source_id" text NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"author" text,
	"description" text,
	"content" text,
	"image_url" text,
	"published_at" integer NOT NULL,
	"created_at" integer NOT NULL,
	"updated_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reading_items" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"article_id" text NOT NULL,
	"status" text DEFAULT 'unread',
	"progress" integer,
	"ai_summary" text,
	"created_at" integer NOT NULL,
	"updated_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rss_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"icon_url" text,
	"category" text,
	"is_active" text DEFAULT 'true',
	"last_fetched_at" integer,
	"created_at" integer NOT NULL,
	"updated_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" integer NOT NULL,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"avatar_url" text,
	"password_hash" text,
	"created_at" integer NOT NULL,
	"updated_at" integer NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_annotations" ADD CONSTRAINT "ai_annotations_reading_item_id_reading_items_id_fk" FOREIGN KEY ("reading_item_id") REFERENCES "public"."reading_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articles" ADD CONSTRAINT "articles_source_id_rss_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."rss_sources"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reading_items" ADD CONSTRAINT "reading_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reading_items" ADD CONSTRAINT "reading_items_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rss_sources" ADD CONSTRAINT "rss_sources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
