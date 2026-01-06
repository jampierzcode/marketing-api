import type Restaurant from '#models/restaurant'
import type CampaignRequest from '#models/campaign_request'
import type CampaignIdea from '#models/campaign_idea'
import type Asset from '#models/asset'

type Storybeat = {
  tStart: number
  tEnd: number
  onScreen: string
  shot: string
  assetTagHint?: string
}

export default class BriefGeneratorService {
  static async generate(input: {
    restaurant: Restaurant
    campaignRequest: CampaignRequest
    idea: CampaignIdea
    assets: Asset[]
  }) {
    const duration = input.campaignRequest.duration
    const total = duration === '6s' ? 6 : duration === '10s' ? 10 : 15

    const findAssetByTag = (tag: string) => {
      const a = input.assets.find((x) => Array.isArray(x.tags) && x.tags.includes(tag))
      return a ? `${a.type}: ${a.url}` : `Asset sugerido con tag "${tag}" (no encontrado)`
    }

    const storyboard: Storybeat[] = [
      {
        tStart: 0,
        tEnd: Math.min(2, total),
        onScreen: 'Plan de hoy: Cantina 🔥',
        shot: `Entrada/terraza. ${findAssetByTag('terraza')}`,
        assetTagHint: 'terraza',
      },
      {
        tStart: Math.min(2, total),
        tEnd: Math.min(7, total),
        onScreen: 'Cocteles + comida',
        shot: `Close-up coctel. ${findAssetByTag('cocteles')}`,
        assetTagHint: 'cocteles',
      },
      {
        tStart: Math.min(7, total),
        tEnd: total,
        onScreen: 'Reserva por WhatsApp',
        shot: `Ambiente/música. ${findAssetByTag('musica')}`,
        assetTagHint: 'musica',
      },
    ].filter((b) => b.tStart < total)

    const capcutRecipe = storyboard.map((b, idx) => ({
      step: idx + 1,
      clip: b.assetTagHint ?? 'general',
      duration: `${b.tEnd - b.tStart}s`,
      onScreenText: b.onScreen,
      notes: b.shot,
    }))

    return {
      hook: input.idea.title,
      cta:
        input.campaignRequest.objective === 'whatsapp'
          ? 'Escríbenos por WhatsApp para reservar'
          : 'Reserva tu mesa hoy',
      onScreenText: storyboard.map((b) => b.onScreen),
      storyboard,
      capcutRecipe,
    }
  }
}
