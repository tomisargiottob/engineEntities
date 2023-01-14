import Server from "./components/server";
import logger from "./components/logger";
import config from 'config'

async function main() {
  const log = logger.child({service: 'Engine-Entities'})
  const server = new Server({logger: log}, config)

  await server.run()
}

main()