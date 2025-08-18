import { createHash, randomBytes } from "crypto";
import * as bcrypt from 'bcrypt';

export const generateSecret = (bytes = 32): string  => randomBytes(bytes).toString('base64url');

export const hashSecret = (secret: string) => createHash('sha256').update(secret, 'utf8').digest('hex');

export const hashPassword = async (password: string) => await bcrypt.hash(password, 12);

export const verifyPassword = async (password: string, passwordHash: string) => await bcrypt.compare(password, passwordHash);