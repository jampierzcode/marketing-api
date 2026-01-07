import router from '@adonisjs/core/services/router'

const RestaurantsController = () => import('#controllers/restaurants_controller')
const RestaurantPromosController = () => import('#controllers/restaurant_promos_controller')
const AssetsController = () => import('#controllers/assets_controller')

const CampaignRequestsController = () => import('#controllers/campaign_requests_controller')
const CampaignIdeasController = () => import('#controllers/campaign_ideas_controller')
const CreativeBriefsController = () => import('#controllers/creative_briefs_controller')

const VideosController = () => import('#controllers/videos_controller')
router.get('/health', async () => ({ ok: true }))

router
  .group(() => {
    router.get('/restaurants', [RestaurantsController, 'index'])
    router.post('/restaurants', [RestaurantsController, 'store'])
    router.get('/restaurants/:id', [RestaurantsController, 'show'])
    router.patch('/restaurants/:id', [RestaurantsController, 'update'])

    router.get('/restaurants/:id/promos', [RestaurantPromosController, 'index'])
    router.post('/restaurants/:id/promos', [RestaurantPromosController, 'upsert'])

    router.get('/restaurants/:id/assets', [AssetsController, 'index'])
    router.post('/restaurants/:id/assets', [AssetsController, 'store'])

    router.get('/campaign-requests', [CampaignRequestsController, 'index'])
    router.post('/campaign-requests', [CampaignRequestsController, 'store'])

    router.post('/campaign-requests/:id/ideas', [CampaignIdeasController, 'generateForRequest'])
    router.post('/campaign-ideas/:ideaId/select', [CampaignIdeasController, 'select'])

    router.post('/campaign-requests/:id/brief', [CreativeBriefsController, 'generateForRequest'])
    router.get('/creative-briefs/:id', [CreativeBriefsController, 'show'])

    router.post('/campaign-requests/:id/video', [VideosController, 'createForRequest'])
    router.get('/videos/:videoId', [VideosController, 'status'])
    router.get('/videos/:videoId/content', [VideosController, 'content'])
  })
  .prefix('/api')
