export const INSERT_REFRESH_TOKEN = `
    INSERT INTO refresh_tokens (user_id, secret_hash, expires_at)
    VALUES ($1, $2, $3)
    RETURNING
        id,
        user_id,
        expires_at,
        created_at
`;

export const REVOKE_REFRESH_TOKENS = `
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE user_id = $1
    AND revoked_at IS NULL;
`;