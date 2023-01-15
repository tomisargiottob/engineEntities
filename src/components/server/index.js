import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import path from 'path'

class Server {
  constructor({logger}, config) {
    this.config = config;
    this.logger = logger.child({module: 'Server'})
    const PROTO_PATH = `${path.resolve()}/src/components/server/protos/enitites.proto`
    const packageDefinition = protoLoader. loadSync(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }
    );
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
    const { Entities } = protoDescriptor;
    this.grpcServer = new grpc.Server();
    this.grpcServer.addService(Entities.service,{
      createEntity: async (call, callback) => {
        try {
          callback(null, true)
        } catch (err) {
          callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: err.message
          })
        }
      },
      updateEntity: async (call, callback) => {
        try {
          callback(null, true)
        } catch (err) {
          callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: err.message
          })
        }
      },
      identifyEntities: async (call, callback) => {
        try {
          callback(null, {entities: ['tomi','dali']})
        } catch (err) {
          callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: err.message
          })
        }
      }
    })
  }
  async run() {
    await new Promise((resolve, reject) => {
      this.grpcServer.bindAsync(`127.0.0.1:${this.config.port}`, grpc.ServerCredentials.createInsecure(), (err)=>{
        if(err) {
          reject(err)
        }
        resolve()
      })
    })
    await this.grpcServer.start()
  }
}

export default Server