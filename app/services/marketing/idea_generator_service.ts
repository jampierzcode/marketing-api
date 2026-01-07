import env from '#start/env'
import openai from '#services/openai_client'
import type Restaurant from '#models/restaurant'
import type CampaignRequest from '#models/campaign_request'

type Trend = { type: string; text: string }
type Insight = { type: string; text: string }

type Idea = {
  title: string
  description: string
  rationale: string
  recommendedTags?: string[]
}

function safeJsonParse<T>(s: string): T {
  // intenta parse directo; si viene con ```json ... ``` lo limpia
  const cleaned = s
    .trim()
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim()
  return JSON.parse(cleaned) as T
}

export default class IdeaGeneratorService {
  static async generate(input: {
    restaurant: Restaurant
    campaignRequest: CampaignRequest
    trends: Trend[]
    history: Insight[]
    assetTags?: string[]
    promos?: { day: string; text: string }[]
  }): Promise<Idea[]> {
    const model = env.get('OPENAI_TEXT_MODEL') || 'gpt-4.1'

    const prompt = `
Eres un estratega de marketing para restaurantes. Devuelve SOLO JSON válido.

Contexto restaurante:
- name: ${input.restaurant.name}
- city: ${input.restaurant.city ?? ''}
- zone: ${input.restaurant.zone ?? ''}
- tone: ${input.restaurant.tone ?? ''}
- offers: ${input.restaurant.offers ?? ''}
- hours: ${input.restaurant.hours ?? ''}

Promos por día:
${(input.promos ?? []).map((p) => `- ${p.day}: ${p.text}`).join('\n') || '(sin promos)'}

Assets (tags disponibles):
${(input.assetTags ?? []).join(', ') || '(sin tags)'}

Solicitud de campaña:
- objective: ${input.campaignRequest.objective}
- dayToPush: ${input.campaignRequest.dayToPush}
- budgetDaily: ${input.campaignRequest.budgetDaily}
- zone: ${input.campaignRequest.zone ?? ''}
- duration: ${input.campaignRequest.duration}
- videoMethod: ${input.campaignRequest.videoMethod}

Tendencias:
${input.trends.map((t) => `- ${t.type}: ${t.text}`).join('\n')}

Historial:
${input.history.map((h) => `- ${h.type}: ${h.text}`).join('\n')}

Devuelve EXACTAMENTE este formato (3 ideas):
{
  "ideas": [
    {
      "title": "string (máx 50)",
      "description": "string (máx 260)",
      "rationale": "string (máx 200)",
      "recommendedTags": ["musica","cocteles"]
    }
  ]
}
`

    const resp = await openai.responses.create({
      model,
      input: prompt,
    })

    const text = resp.output_text
    const data = safeJsonParse<{ ideas: Idea[] }>(text)

    if (!data.ideas || data.ideas.length !== 3) {
      throw new Error('OpenAI no devolvió 3 ideas en el formato esperado')
    }

    return data.ideas
  }
}
