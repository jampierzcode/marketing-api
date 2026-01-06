import type { HttpContext } from '@adonisjs/core/http'
import CampaignRequest from '#models/campaign_request'
import CampaignIdea from '#models/campaign_idea'
import CreativeBrief from '#models/creative_brief'
import Asset from '#models/asset'
import BriefGeneratorService from '#services/marketing/brief_generator_service'

export default class CreativeBriefsController {
  async generateForRequest({ params, response }: HttpContext) {
    const requestId = Number(params.id)
    const req = await CampaignRequest.findOrFail(requestId)
    await req.load('restaurant')

    const selectedIdea = await CampaignIdea.query()
      .where('campaignRequestId', requestId)
      .where('isSelected', true)
      .firstOrFail()

    const assets = await Asset.query().where('restaurantId', req.restaurantId)

    const brief = await BriefGeneratorService.generate({
      restaurant: req.restaurant,
      campaignRequest: req,
      idea: selectedIdea,
      assets,
    })

    await CreativeBrief.query().where('campaignRequestId', requestId).delete()

    const created = await CreativeBrief.create({
      campaignRequestId: requestId,
      hook: brief.hook,
      cta: brief.cta,
      onScreenText: brief.onScreenText,
      storyboard: brief.storyboard,
      capcutRecipe: brief.capcutRecipe,
    })

    return response.ok(created)
  }

  async show({ params, response }: HttpContext) {
    const brief = await CreativeBrief.findOrFail(params.id)
    return response.ok(brief)
  }
}
