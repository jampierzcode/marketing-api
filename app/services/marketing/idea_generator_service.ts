import type Restaurant from '#models/restaurant'
import type CampaignRequest from '#models/campaign_request'

type Trend = { type: string; text: string }
type Insight = { type: string; text: string }

export default class IdeaGeneratorService {
  static generate(input: {
    restaurant: Restaurant
    campaignRequest: CampaignRequest
    trends: Trend[]
    history: Insight[]
  }) {
    const day = input.campaignRequest.dayToPush
    const tone = input.restaurant.tone ?? 'cálido y directo'

    return [
      {
        title: `Hook “Plan de ${day.toUpperCase()}”`,
        description: `Video corto con 3 highlights (ambiente + producto + música). Tono: ${tone}.`,
        rationale: `Trend: ${input.trends[0]?.text ?? 'hook rápido'}`,
      },
      {
        title: 'Cumpleaños / celebración',
        description: 'Brindis + mesa feliz + CTA “Reserva tu mesa”.',
        rationale: 'Ángulo universal para reservas.',
      },
      {
        title: 'Música en vivo / experiencia',
        description: 'Audio/energía + 2–3 tomas banda + reacción + coctel.',
        rationale: `Formato: ${input.trends.find((t) => t.type === 'format')?.text ?? '9:16'}`,
      },
    ]
  }
}
