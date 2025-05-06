import type { Context } from 'hono'

import {
  getUserSummaryModel,
  submitSummaryModel
} from '../models/summary.model.js'

export const submitSummary = async (c: Context) => {
  const body = await c.req.json()
  const result = await submitSummaryModel(body)
  return c.json(result, 201)
}

export const getUserSummary = async (c: Context) => {
  const userId = c.req.param('userId')
  const data = await getUserSummaryModel(userId)
  return c.json(data)
}
