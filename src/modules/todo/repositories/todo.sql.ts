export const INSERT_TODO = `
    INSERT INTO todos (user_id, title)
    VALUES ($1, $2)
    RETURNING
        id,
        title,
        is_done,
        created_at
`;

export const SELECT_BY_ID = `
    SELECT id, title, is_done, created_at, updated_at
    FROM todos
    WHERE id = $1 AND user_id = $2;
`;

export const FILTER_SELECT = `
    SELECT id, title, is_done, created_at, updated_at
    FROM todos
    WHERE user_id = $1
        AND ($2::text IS NULL OR title ILIKE '%' || $2 || '%')
        AND ($3::boolean IS NULL OR is_done = $3)
    ORDER BY
        CASE WHEN $4 = 'ASC'  THEN created_at END ASC,
        CASE WHEN $4 = 'DESC' THEN created_at END DESC
    LIMIT $5 OFFSET $6;
`;

export const UPDATE_TODO = `
    UPDATE todos
    SET title = COALESCE($3, title),
        is_done  = COALESCE($4, is_done)
    WHERE id = $1 AND user_id = $2
    RETURNING id, title, is_done, created_at, updated_at;
`;

export const DELETE_TODO = `
    DELETE FROM todos
    WHERE id = $1 AND user_id = $2;
`;