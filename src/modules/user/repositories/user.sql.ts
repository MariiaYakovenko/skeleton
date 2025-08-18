export const SELECT_BY_EMAIL = `
  SELECT id, email, password_hash
  FROM users
  WHERE email = $1
`;

export const INSERT_USER = `
  INSERT INTO users (email, password_hash)
  VALUES ($1, $2)
  RETURNING
    id,
    email,
    created_at
`;

export const UPDATE_PASSWORD_BY_EMAIL = `
  UPDATE users
  SET password_hash = $2
  WHERE email = $1
  RETURNING id, email, updated_at;
`;