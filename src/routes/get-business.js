import { request } from 'undici'
import { config } from '../config.js'
// import fetcher from '../common/helpers/fetcher.js'
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
  handler: async (req, h) => {
    logger.info(`GET /get-business with params: ${JSON.stringify(req.params)}`)
    const { statusCode, body } = await request(`${kitsURL.href}/organisation/${req.params.id}`,{
      headers: {
        'content-type': 'application/json',
        email: 'Test.User01@defra.gov.uk'
      }
    })
    logger.info(`Response status code: ${statusCode}`)

    const result = await body.json()
    logger.info(`business object with keys: ${Object.keys(result)}`)
    const { name, sbi, orgId } = result._data

    return h.response({ name, sbi, orgId })
  }
}

export { getBusiness }
