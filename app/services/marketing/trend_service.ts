// MVP: stub. Luego: TikTok Creative Center + etc.
export default class TrendService {
  static async getTrends(_input: { city: string; zone: string; objective: string }) {
    return [
      { type: 'hook', text: '“Plan de hoy: ___” (corte rápido, 0–1s)' },
      { type: 'hook', text: '“Si te dijeron: ¿a dónde vamos?” (pregunta + reveal)' },
      { type: 'format', text: '9:16, textos grandes, 1 idea por escena' },
      { type: 'cta', text: 'CTA claro en los últimos 2s: “Reserva por WhatsApp”' },
    ]
  }
}
