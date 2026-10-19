import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL is always accurate regardless of environment or working directory
if (process.env.VERCEL) {
  const tmpDb = '/tmp/custom.db'
  if (!fs.existsSync(tmpDb)) {
    const srcDb = path.join(process.cwd(), 'db', 'custom.db')
    if (fs.existsSync(/* turbopackIgnore: true */ srcDb)) {
      try {
        fs.copyFileSync(srcDb, tmpDb)
      } catch (e) {
        console.error('Failed to copy custom.db to /tmp:', e)
      }
    }
  }
  process.env.DATABASE_URL = `file:${tmpDb}`
} else if (
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes('/home/z/') ||
  process.env.DATABASE_URL === 'file:../db/custom.db'
) {
  const localDb = path.resolve(process.cwd(), 'db', 'custom.db').replace(/\\/g, '/')
  if (fs.existsSync(localDb)) {
    process.env.DATABASE_URL = `file:${localDb}`
  } else {
    process.env.DATABASE_URL = 'file:../db/custom.db'
  }
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
