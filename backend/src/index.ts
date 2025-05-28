  import { serve } from '@hono/node-server'
  import { Hono } from 'hono'
  import { PrismaClient } from './generated/prisma/index.js'
  import mainRouter from './routes/index.js'
  import { cors } from 'hono/cors'
  import dotenv from 'dotenv'

  dotenv.config()

  const app = new Hono()
  export const db = new PrismaClient()


  app.use(
    '*', 
    cors({
      origin: 'http://localhost:5173', // Your frontend's address
      credentials: true,
    })
  )


  app.route('/', mainRouter)

  app.get('/', (c) => c.text('Hello Hono!'))

  serve({
    fetch: app.fetch,
    port: 8000,
  }, (info) => {
    console.log(`🚀 Server ready at http://localhost:${info.port}`)
  })
