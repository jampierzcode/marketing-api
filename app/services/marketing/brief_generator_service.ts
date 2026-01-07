import env from '#start/env'
import openai from '#services/openai_client'
import type Restaurant from '#models/restaurant'
import type CampaignRequest from '#models/campaign_request'
import type CampaignIdea from '#models/campaign_idea'
import type Asset from '#models/asset'

type Brief = {
  hook: string
  cta: string
  onScreenText: string[]
  storyboard: Array<{
    tStart: number
    tEnd: number
    onScreen: string
    shot: string
    assetTagHint?: string
  }>
  capcutRecipe: Array<{
    step: number
    clip: string
    duration: string
    onScreenText: string
    notes: string
  }>
}

function safeJsonParse<T>(s: string): T {
  const cleaned = s
    .trim()
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim()
  return JSON.parse(cleaned) as T
}

export default class BriefGeneratorService {
  static async generate(input: {
    restaurant: Restaurant
    campaignRequest: CampaignRequest
    idea: CampaignIdea
    assets: Asset[]
  }): Promise<Brief> {
    const model = env.get('OPENAI_TEXT_MODEL') || 'gpt-4.1'
    const seconds =
      input.campaignRequest.duration === '6s'
        ? 6
        : input.campaignRequest.duration === '10s'
          ? 10
          : 15

    const assetsSummary = input.assets.map((a) => ({
      id: a.id,
      type: a.type,
      url: a.url,
      tags: a.tags ?? [],
    }))

    const prompt = `
Eres un director creativo para anuncios de restaurante. Devuelve SOLO JSON válido.

Restaurante:
- name: ${input.restaurant.name}
- tone: ${input.restaurant.tone ?? ''}
- city/zone: ${input.restaurant.city ?? ''} / ${input.restaurant.zone ?? ''}

Campaña:
- objective: ${input.campaignRequest.objective}
- dayToPush: ${input.campaignRequest.dayToPush}
- seconds: ${seconds}

Idea seleccionada:
- title: ${input.idea.title}
- description: ${input.idea.description}

Assets disponibles (elige por tags; si no hay, sugiere):
${JSON.stringify(assetsSummary, null, 2)}

Devuelve EXACTAMENTE:
{
  "hook": "string",
  "cta": "string",
  "onScreenText": ["..."],
  "storyboard": [
    {"tStart":0,"tEnd":2,"onScreen":"...","shot":"...","assetTagHint":"terraza"}
  ],
  "capcutRecipe": [
    {"step":1,"clip":"terraza","duration":"2s","onScreenText":"...","notes":"..."}
  ]
}
`

    const resp = await openai.responses.create({
      model,
      input: prompt,
    })

    const data = safeJsonParse<Brief>(resp.output_text)

    if (!data.storyboard?.length || !data.capcutRecipe?.length) {
      throw new Error('OpenAI no devolvió storyboard/receta en formato esperado')
    }

    return data
  }
}
