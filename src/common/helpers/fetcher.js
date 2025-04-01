import { Client } from 'undici'
import { config } from '../../config.js'
import { createLogger } from './logging/logger.js'

const decodeBase64 = (value = '') => Buffer.from(value, 'base64').toString('ascii')

let client
const logger = createLogger()
const fetch = (path, method = 'GET') => {
  logger.info(`Fetching ${path} with method ${method}`)
  return client.request({ path, method })
}

export default {
  decodeBase64,
  get fetch() {
    if (!client) {
      if (config.get('kitsConnection.key') && config.get('kitsConnection.cert')) {
        const tls = {
          key: decodeBase64(config.get('kitsConnection.key')),
          cert: decodeBase64(config.get('kitsConnection.cert')),
          rejectUnauthorized: false,
          servername: config.get('kitsConnection.host')
        }
        logger.info('KITS TLS configuration:')
        logger.info(tls)
        client = new Client(config.get('httpProxy'), { connect: tls })
      } else {
        client = new Client()
      }
    }

    return fetch
  }
}
