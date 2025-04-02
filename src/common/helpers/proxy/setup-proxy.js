import tls from 'node:tls'
import { ProxyAgent, setGlobalDispatcher } from 'undici'

import { config } from '../../../config.js'
import fetcher from '../fetcher.js'
import { createLogger } from '../logging/logger.js'

const logger = createLogger()

/**
 * If HTTP_PROXY is set setupProxy() will enable it globally
 * for undici http clients.
 */
export function setupProxy() {
  const proxyUrl = config.get('httpProxy')

  if (proxyUrl) {
    logger.info('setting up global proxies')

    const requestTls = {
      host: config.get('kitsConnection.host'),
      port: config.get('kitsConnection.port'),
      path: config.get('kitsConnection.path'),
      // rejectUnauthorized: false,
      servername: config.get('kitsConnection.host'),
      secureContext: tls.createSecureContext({
        key: fetcher.decodeBase64(config.get('kitsConnection.key')),
        cert: fetcher.decodeBase64(config.get('kitsConnection.cert'))
      })
    }
    logger.info('KITS TLS configuration:', requestTls)

    const proxyAgent = new ProxyAgent({ uri: proxyUrl, requestTls })
    // Undici proxy
    setGlobalDispatcher(proxyAgent)

    return proxyAgent
  }
}
