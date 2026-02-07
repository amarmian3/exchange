import { Pool } from 'pg';
import { DATABASE_URL } from '$env/static/private';

export const pool = new Pool({
  connectionString: DATABASE_URL
  // If your hosted DB requires SSL, uncomment:
  // ssl: { rejectUnauthorized: false }
});
