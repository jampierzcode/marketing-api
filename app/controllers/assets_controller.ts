import type { HttpContext } from '@adonisjs/core/http'
import Asset from '#models/asset'
import vine from '@vinejs/vine'

const createAssetValidator = vine.compile(
  vine.object({
    type: vine.enum(['photo', 'video'] as const),
    url: vine.string().trim().minLength(3),
    tags: vine.array(vine.string().trim().minLength(1)).optional(),
  })
)

export default class AssetsController {
  async index({ params, request, response }: HttpContext) {
    const restaurantId = Number(params.id)
    const tag = request.qs().tag as string | undefined

    const q = Asset.query().where('restaurantId', restaurantId).orderBy('id', 'desc')

    // Postgres jsonb array contains: tags @> '["tag"]'
    if (tag) {
      q.whereRaw('tags @> ?::jsonb', [JSON.stringify([tag])])
    }

    return response.ok(await q)
  }

  async store({ params, request, response }: HttpContext) {
    const restaurantId = Number(params.id)
    const payload = await request.validateUsing(createAssetValidator)
    console.log(payload)
    const asset = await Asset.create({
      restaurantId,
      type: payload.type,
      url: payload.url,
      tags: payload.tags ?? [],
    })

    return response.created(asset)
  }
}
