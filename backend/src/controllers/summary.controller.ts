import type { Context } from 'hono'

import {
  getUserSummaryModel,
  submitSummaryModel
} from '../models/summary.model.js'

export const submitSummary = async (c: Context) => { // Assuming 'c' is a Context object from Hono or a similar framework
  let body;
  try {
    console.log('[submitSummary] Attempting to parse request body...');
    body = await c.req.json();
    console.log('[submitSummary] Request body parsed successfully:', body);
    if (typeof body.userId !== 'number' ||
        typeof body.quizId !== 'number' ||
        typeof body.score !== 'number' ||
        typeof body.wrong !== 'number' ||
        typeof body.unanswered !== 'number') {
      console.error('[submitSummary] Invalid data types or missing fields in request body:', body);
      return c.json({ error: "Invalid data: All fields (userId, quizId, score, wrong, unanswered) must be numbers." }, 400); // Bad Request
    }

    console.log('[submitSummary] Calling submitSummaryModel with body:', body);
    const result = await submitSummaryModel(body);
    console.log('[submitSummary] submitSummaryModel executed successfully. Result:', result);
    return c.json(result, 201);

  } catch (error) {
    console.error("[submitSummary] Error in controller:", error);
    if (body) {
      console.error("[submitSummary] Request body at time of error:", body);
    }
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return c.json({ error: "Invalid JSON in request body.", details: error.message }, 400);
    }
    return c.json({ error: "Internal Server Error.", details: error.message }, 500);
  }
};

export const getUserSummary = async (c: Context) => {
  const userIdParam = c.req.param('userId');
  const userId = parseInt(userIdParam, 10);
  const data = await getUserSummaryModel(userId);
  return c.json(data)
}