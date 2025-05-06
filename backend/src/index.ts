import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from './generated/prisma/index.js'
import mainRouter from './routes/index.js'

const app = new Hono()
export const db = new PrismaClient();

app.route("", mainRouter);

app.get('/', (c) => { 
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
