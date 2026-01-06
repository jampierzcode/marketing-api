import type { HttpContext } from '@adonisjs/core/http'
import RestaurantPromo from '#models/restaurant_promo'
import vine from '@vinejs/vine'

const upsertPromosValidator = vine.compile(
  vine.object({
    promos: vine
      .array(
        vine.object({
          day: vine.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const),
          text: vine.string().trim().minLength(2),
        })
      )
      .minLength(1),
  })
)

export default class RestaurantPromosController {
  async index({ params, response }: HttpContext) {
    const promos = await RestaurantPromo.query()
      .where('restaurantId', params.id)
      .orderBy('day', 'asc')
    return response.ok(promos)
  }

  async upsert({ params, request, response }: HttpContext) {
    const { promos } = await request.validateUsing(upsertPromosValidator)
    const restaurantId = Number(params.id)

    await RestaurantPromo.query().where('restaurantId', restaurantId).delete()
    await RestaurantPromo.createMany(promos.map((p) => ({ ...p, restaurantId })))

    const saved = await RestaurantPromo.query()
      .where('restaurantId', restaurantId)
      .orderBy('day', 'asc')
    return response.ok(saved)
  }
}
