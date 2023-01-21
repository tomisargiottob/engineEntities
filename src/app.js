import Server from "./components/server";
import logger from "./components/logger";
import config from 'config'
import Database from './components/database'

async function main() {
  const log = logger.child({service: 'Engine-Entities'})
  const db = new Database({logger: log}, config.db);
  await db.connect()
  const server = new Server({logger: log, db}, config)
  await server.run()
  log.info('Server up and running')
}

main()