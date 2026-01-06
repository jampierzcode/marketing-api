import type { HttpContext } from '@adonisjs/core/http'
import CampaignRequest from '#models/campaign_request'
import CampaignIdea from '#models/campaign_idea'
import MarketingBrainService from '#services/marketing/marketing_brain_service'

export default class CampaignIdeasController {
  async generateForRequest({ params, response }: HttpContext) {
    const requestId = Number(params.id)
    const req = await CampaignRequest.findOrFail(requestId)
    await req.load('restaurant')

    await CampaignIdea.query().where('campaignRequestId', requestId).delete()

    const ideas = await MarketingBrainService.generateIdeas({
      restaurant: req.restaurant,
      campaignRequest: req,
    })

    const created = await CampaignIdea.createMany(
      ideas.map((i) => ({
        campaignRequestId: requestId,
        title: i.title,
        description: i.description,
        rationale: i.rationale,
        isSelected: false,
      }))
    )

    return response.ok(created)
  }

  async select({ params, response }: HttpContext) {
    const ideaId = Number(params.ideaId)
    const idea = await CampaignIdea.findOrFail(ideaId)

    await CampaignIdea.query()
      .where('campaignRequestId', idea.campaignRequestId)
      .update({ isSelected: false })

    idea.isSelected = true
    await idea.save()

    return response.ok(idea)
  }
}
