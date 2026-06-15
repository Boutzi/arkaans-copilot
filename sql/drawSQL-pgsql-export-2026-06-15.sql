CREATE TABLE "temp_channel"(
    "id" UUID NOT NULL,
    "discord_id" VARCHAR(255) NOT NULL,
    "temp_channel_name" VARCHAR(255) NOT NULL,
    "source_channel_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "temp_channel" ADD PRIMARY KEY("id");
CREATE TABLE "source_channel"(
    "id" UUID NOT NULL,
    "discord_id" VARCHAR(255) NOT NULL,
    "source_channel_name" VARCHAR(255) NOT NULL,
    "name_list" TEXT[] NOT NULL,
    "guild_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "source_channel" ADD PRIMARY KEY("id");
CREATE TABLE "guild"(
    "id" UUID NOT NULL,
    "discord_id" VARCHAR(255) NOT NULL,
    "guild_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "guild" ADD PRIMARY KEY("id");
CREATE TABLE "welcome_config"(
    "id" UUID NOT NULL,
    "target_channel_id" VARCHAR(255) NOT NULL,
    "target_channel_name" VARCHAR(255) NOT NULL,
    "background_url" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "hex_color" VARCHAR(255) NOT NULL,
    "welcome_message" VARCHAR(255) NOT NULL,
    "guild_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "welcome_config" ADD PRIMARY KEY("id");
ALTER TABLE
    "guild" ADD CONSTRAINT "guild_discord_id_foreign" FOREIGN KEY("discord_id") REFERENCES "welcome_config"("guild_id");
ALTER TABLE
    "temp_channel" ADD CONSTRAINT "temp_channel_source_channel_id_foreign" FOREIGN KEY("source_channel_id") REFERENCES "source_channel"("discord_id");
ALTER TABLE
    "source_channel" ADD CONSTRAINT "source_channel_guild_id_foreign" FOREIGN KEY("guild_id") REFERENCES "guild"("discord_id");