import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import openai from '#services/openai_client'
import CampaignRequest from '#models/campaign_request'
import CampaignIdea from '#models/campaign_idea'
import CreativeBrief from '#models/creative_brief'
import Asset from '#models/asset'
import type { VideoSize } from 'openai/resources/videos'

function mapSeconds(duration: '6s' | '10s' | '15s') {
  // Sora API permite 4/8/12 (string). :contentReference[oaicite:6]{index=6}
  if (duration === '6s') return '8'
  return '12'
}

const allowedSizes: VideoSize[] = ['720x1280', '1280x720', '1024x1792', '1792x1024']

const rawSize = env.get('OPENAI_VIDEO_SIZE') || '720x1280'
const size: VideoSize = allowedSizes.includes(rawSize as VideoSize)
  ? (rawSize as VideoSize)
  : '720x1280'

export default class VideosController {
  async createForRequest({ params, response }: HttpContext) {
    const requestId = Number(params.id)
    const req = await CampaignRequest.findOrFail(requestId)
    await req.load('restaurant')

    const idea = await CampaignIdea.query()
      .where('campaignRequestId', requestId)
      .where('isSelected', true)
      .firstOrFail()

    // si ya existe brief, úsalo; si no, intenta tomar el último
    const brief = await CreativeBrief.query()
      .where('campaignRequestId', requestId)
      .orderBy('id', 'desc')
      .first()

    const assets = await Asset.query().where('restaurantId', req.restaurantId)

    const seconds = mapSeconds(req.duration)
    const model = env.get('OPENAI_VIDEO_MODEL') || 'sora-2'

    // Prompt de video (puedes refinar después)
    const prompt = `
Crea un video vertical tipo TikTok/Reel (${size}) de ${seconds}s para ${req.restaurant.name}.
Tono: ${req.restaurant.tone ?? 'elegante'}.

Objetivo: ${req.objective}. Día a impulsar: ${req.dayToPush}.
Idea: ${idea.title} — ${idea.description}

Si hay storyboard, síguelo:
${brief ? JSON.stringify(brief.storyboard, null, 2) : '(sin storyboard)'}

Usa una estética realista, dinámica, con cortes rápidos, y termina con CTA: "${
      req.objective === 'whatsapp' ? 'Reserva por WhatsApp' : 'Reserva tu mesa'
    }".

Elementos a incluir (inspiración por tags):
${Array.from(new Set(assets.flatMap((a) => a.tags ?? []))).join(', ') || '(sin tags)'}
`.trim()

    // Crea job de video (async) :contentReference[oaicite:7]{index=7}
    const job = await openai.videos.create({
      model,
      prompt,
      seconds,
      size,
    })

    return response.ok(job) // { id, status, ... }
  }

  async status({ params, response }: HttpContext) {
    const videoId = params.videoId as string
    const job = await openai.videos.retrieve(videoId) // :contentReference[oaicite:8]{index=8}
    return response.ok(job)
  }

  async content({ params, response }: HttpContext) {
    const videoId = params.videoId as string

    // descarga bytes MP4 (por default) :contentReference[oaicite:9]{index=9}
    const res = await openai.videos.downloadContent(videoId)

    // El SDK devuelve un Response compatible (arrayBuffer)
    const ab = await res.arrayBuffer()
    const buf = Buffer.from(ab)

    response.header('Content-Type', 'video/mp4')
    response.header('Content-Disposition', `attachment; filename="${videoId}.mp4"`)
    return response.send(buf)
  }
}
