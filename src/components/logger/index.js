import pino from "pino";
import config from 'config';

const logger= pino({
  level: config.logger.level,
  formatters: {
    bindings (bindings) {
      return { pid: bindings.pid, service: 'Engine' }
    },  
  },
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
  
})

export default logger;