import type { HttpContext } from '@adonisjs/core/http'
import Restaurant from '#models/restaurant'
import vine from '@vinejs/vine'

const createRestaurantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),
    city: vine.string().trim().optional(),
    zone: vine.string().trim().optional(),
    tone: vine.string().trim().optional(),
    hours: vine.string().trim().optional(),
    offers: vine.string().trim().optional(),
  })
)

const updateRestaurantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).optional(),
    city: vine.string().trim().optional(),
    zone: vine.string().trim().optional(),
    tone: vine.string().trim().optional(),
    hours: vine.string().trim().optional(),
    offers: vine.string().trim().optional(),
    metaToken: vine.string().trim().optional(),
    tiktokToken: vine.string().trim().optional(),
  })
)

export default class RestaurantsController {
  async index({ response }: HttpContext) {
    const rows = await Restaurant.query().orderBy('id', 'desc')
    return response.ok(rows)
  }

  async show({ params, response }: HttpContext) {
    const restaurant = await Restaurant.findOrFail(params.id)
    await restaurant.load('promos')
    return response.ok(restaurant)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createRestaurantValidator)
    const restaurant = await Restaurant.create(payload)
    return response.created(restaurant)
  }

  async update({ params, request, response }: HttpContext) {
    const restaurant = await Restaurant.findOrFail(params.id)
    const payload = await request.validateUsing(updateRestaurantValidator)
    restaurant.merge(payload)
    await restaurant.save()
    return response.ok(restaurant)
  }
}
