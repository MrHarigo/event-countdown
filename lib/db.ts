import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

// Lazily create the connection so importing this module never requires
// DATABASE_URL. `next build` evaluates server modules during page-data
// collection, where the connection string is not (and need not be)
// available — eager init throws there. The string is only read when the
// first query actually runs, at request time.
let _sql: NeonQueryFunction<false, false> | null = null

export const sql: NeonQueryFunction<false, false> = ((
  ...args: Parameters<NeonQueryFunction<false, false>>
) => {
  if (!_sql) _sql = neon(process.env.DATABASE_URL!)
  return _sql(...args)
}) as NeonQueryFunction<false, false>
