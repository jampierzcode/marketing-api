import type { HttpContext } from '@adonisjs/core/http'
import CampaignRequest from '#models/campaign_request'
import vine from '@vinejs/vine'

const createCampaignRequestValidator = vine.compile(
  vine.object({
    restaurantId: vine.number(),
    objective: vine.enum(['reservations', 'whatsapp', 'reach'] as const),
    dayToPush: vine.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const),
    budgetDaily: vine.number().min(1),
    zone: vine.string().trim().optional(),
    duration: vine.enum(['6s', '10s', '15s'] as const),
    videoMethod: vine.enum(['manual_capcut', 'canva_template', 'tiktok_symphony'] as const),
  })
)

export default class CampaignRequestsController {
  async index({ request, response }: HttpContext) {
    const restaurantId = request.qs().restaurantId ? Number(request.qs().restaurantId) : undefined
    const q = CampaignRequest.query().preload('ideas').orderBy('id', 'desc')
    if (restaurantId) q.where('restaurantId', restaurantId)
    return response.ok(await q)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCampaignRequestValidator)
    const row = await CampaignRequest.create({ ...payload, status: 'draft' })
    return response.created(row)
  }
}
