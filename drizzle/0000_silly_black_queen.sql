CREATE TABLE `bodyweight_event` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`source_row_hash` text,
	`local_date` text NOT NULL,
	`local_time` text,
	`timestamp` integer,
	`measurement` text NOT NULL,
	`value` real NOT NULL,
	`unit` text NOT NULL,
	`comment` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bodyweight_source_row_unique` ON `bodyweight_event` (`source`,`source_row_hash`);--> statement-breakpoint
CREATE INDEX `bodyweight_measurement_idx` ON `bodyweight_event` (`measurement`);--> statement-breakpoint
CREATE INDEX `bodyweight_date_idx` ON `bodyweight_event` (`local_date`);--> statement-breakpoint
CREATE TABLE `exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`default_equipment` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_name_unique` ON `exercise` (`name`);--> statement-breakpoint
CREATE TABLE `historical_set_event` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`source_row_hash` text NOT NULL,
	`local_date` text NOT NULL,
	`exercise_name` text NOT NULL,
	`exercise_id` text,
	`category` text,
	`weight` real,
	`weight_unit` text,
	`reps` integer,
	`distance` real,
	`distance_unit` text,
	`time_seconds` integer,
	`comment` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `historical_set_source_row_unique` ON `historical_set_event` (`source`,`source_row_hash`);--> statement-breakpoint
CREATE INDEX `historical_set_exercise_idx` ON `historical_set_event` (`exercise_name`);--> statement-breakpoint
CREATE INDEX `historical_set_date_idx` ON `historical_set_event` (`local_date`);--> statement-breakpoint
CREATE TABLE `workout_event` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text,
	`template_snapshot` text,
	`local_date` text NOT NULL,
	`start_timestamp` integer,
	`end_timestamp` integer,
	`timezone_offset_minutes` integer,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `workout_template`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `we_local_date_idx` ON `workout_event` (`local_date`);--> statement-breakpoint
CREATE TABLE `workout_exercise_event` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_event_id` text NOT NULL,
	`source_template_exercise_id` text,
	`exercise_id` text NOT NULL,
	`order_index` integer NOT NULL,
	`equipment_variation` text,
	`status` text DEFAULT 'planned' NOT NULL,
	`substituted_for_exercise_id` text,
	`target_sets` integer,
	`target_reps_min` integer,
	`target_reps_max` integer,
	`target_load` real,
	`target_load_unit` text DEFAULT 'lbs',
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workout_event_id`) REFERENCES `workout_event`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`substituted_for_exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `wee_workout_event_idx` ON `workout_exercise_event` (`workout_event_id`);--> statement-breakpoint
CREATE TABLE `workout_set_event` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_exercise_event_id` text NOT NULL,
	`set_number` integer NOT NULL,
	`target_reps` integer,
	`target_load` real,
	`target_load_unit` text DEFAULT 'lbs',
	`actual_reps` integer,
	`actual_load` real,
	`actual_load_unit` text DEFAULT 'lbs',
	`completed` integer DEFAULT false NOT NULL,
	`rir` integer,
	`rpe` real,
	`notes` text,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`workout_exercise_event_id`) REFERENCES `workout_exercise_event`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `wse_exercise_event_idx` ON `workout_set_event` (`workout_exercise_event_id`);--> statement-breakpoint
CREATE TABLE `workout_template` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_template_exercise` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`order_index` integer NOT NULL,
	`exercise_id` text NOT NULL,
	`equipment_variation` text,
	`target_sets` integer,
	`target_reps_min` integer,
	`target_reps_max` integer,
	`target_load` real,
	`target_load_unit` text DEFAULT 'lbs',
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `workout_template`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `wte_template_idx` ON `workout_template_exercise` (`template_id`);--> statement-breakpoint
CREATE TABLE `workout_template_schedule` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`day_of_week` integer,
	`specific_date` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `workout_template`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `wts_template_idx` ON `workout_template_schedule` (`template_id`);