import type Restaurant from '#models/restaurant'
import type CampaignRequest from '#models/campaign_request'
import TrendService from '#services/marketing/trend_service'
import RestaurantHistoryService from '#services/marketing/restaurant_history_service'
import IdeaGeneratorService from '#services/marketing/idea_generator_service'

export default class MarketingBrainService {
  static async generateIdeas(input: { restaurant: Restaurant; campaignRequest: CampaignRequest }) {
    const trends = await TrendService.getTrends({
      city: input.restaurant.city ?? '',
      zone: input.restaurant.zone ?? '',
      objective: input.campaignRequest.objective,
    })

    const history = await RestaurantHistoryService.getInsights({
      restaurantId: input.restaurant.id,
    })

    return IdeaGeneratorService.generate({
      restaurant: input.restaurant,
      campaignRequest: input.campaignRequest,
      trends,
      history,
    })
  }
}
