BEGIN;

CREATE TABLE IF NOT EXISTS migrations (
    id          TEXT        PRIMARY KEY,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE EXTENSION IF NOT EXISTS citext;

CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS trigger
    LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS users
(
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         CITEXT      UNIQUE NOT NULL,
    password_hash TEXT        NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NULL
);

DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'users_set_updated_at') THEN
            CREATE TRIGGER users_set_updated_at
                BEFORE UPDATE ON users
                FOR EACH ROW
            EXECUTE FUNCTION set_updated_at();
        END IF;
    END $$;

CREATE TABLE IF NOT EXISTS refresh_tokens
(
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    secret_hash TEXT        NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id_not_revoked
    ON refresh_tokens (user_id) WHERE revoked_at IS NULL;

DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'refresh_tokens_set_updated_at') THEN
            CREATE TRIGGER refresh_tokens_set_updated_at
                BEFORE UPDATE ON refresh_tokens
                FOR EACH ROW
            EXECUTE FUNCTION set_updated_at();
        END IF;
    END $$;

CREATE TABLE IF NOT EXISTS todos (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR     NOT NULL,
    is_done     BOOLEAN     NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos(user_id);

DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'todos_set_updated_at') THEN
            CREATE TRIGGER todos_set_updated_at
                BEFORE UPDATE ON todos
                FOR EACH ROW
            EXECUTE FUNCTION set_updated_at();
        END IF;
    END $$;

INSERT INTO migrations(id) VALUES ('001_init') ON CONFLICT DO NOTHING;

COMMIT;