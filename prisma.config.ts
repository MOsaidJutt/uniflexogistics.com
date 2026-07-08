import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Prisma CLI does not read .env.local automatically (that is a Next.js convention).
// Load it explicitly so `prisma generate` uses the correct DATABASE_URL.
config({ path: '.env.local' })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL,
  },
})
