import { headers } from 'next/headers'

type Entry = { count: number; resetAt: number }

// In-memory store — works for single-instance deployments.
// Replace with Upstash Redis for multi-instance / serverless.
const store = new Map<string, Entry>()

function check(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= max) return false
  entry.count++
  return true
}

async function getIp(): Promise<string> {
  const h = await headers()
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'unknown'
  )
}

/** 5 logistics lead submissions per hour per IP */
export async function checkLogisticsLeadRate(): Promise<boolean> {
  const ip = await getIp()
  return check(`logistics-lead:${ip}`, 5, 60 * 60 * 1000)
}
