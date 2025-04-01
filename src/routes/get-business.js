import { config } from '../config.js'
import fetcher from '../common/helpers/fetcher.js'
import { createLogger } from '../common/helpers/logging/logger.js'

const logger = createLogger()
const kitsURL = new URL(
  config.get('kitsConnection.path'),
  `https://${config.get('kitsConnection.host')}`
)
kitsURL.port = config.get('kitsConnection.port')
logger.info(`Creating new client for ${kitsURL.href}`)

const getBusiness = {
  method: 'GET',
  path: '/get-business/{id}',
  handler: async (request, h) => {
    logger.info(`GET /get-business with params: ${JSON.stringify(request.params)}`)
    const url = `${kitsURL.href}/organisation/${request.params.id}`
    logger.info(`GET /get-business from KITS: ${url}`)

    const result = await fetcher.fetch(url)
    const { name, sbi, orgId } = result.body

    logger.info(`business object with keys: ${Object.keys(result.body)}`)
    h.response({ name, sbi, orgId })
  }
}

export { getBusiness }
