import CampaignRun from '#models/campaign_run'

export default class RestaurantHistoryService {
  static async getInsights(input: { restaurantId: number }) {
    const lastRuns = await CampaignRun.query()
      .where('restaurantId', input.restaurantId)
      .orderBy('id', 'desc')
      .limit(20)

    if (lastRuns.length === 0) {
      return [{ type: 'note', text: 'Sin histórico aún: usa mejores prácticas base.' }]
    }

    return [{ type: 'note', text: `Se encontraron ${lastRuns.length} campañas previas.` }]
  }
}
