import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import path from 'path'

class Server {
  constructor({logger, db}, config) {
    this.db = db;
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
          this.logger.info('Creating new entity')
          const { entityData, parent } = call.request
          const entityCreationData = { ...parent, ...entityData, matches: []}
          const entity = await this.db.entities.create(entityCreationData)
          this.logger.info('Entity succesfully created')
          callback(null, entity.toJson())
        } catch (err) {
          this.logger.error({reason: err.message},'Error while creating entity')
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
      deleteEntity: async (call, callback) => {
        try {
          this.logger.info('Removing entity')
          callback(null, true)
        } catch (err) {
          callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: err.message
          })
        }
      },
      getEntities: async (call, callback) => {
        try {
          this.logger.info('Fetching entities')
          const {assistantId, skillsetId} = call.request
          const entities = await this.db.entities.getAll(assistantId, skillsetId)
          this.logger.info('Entities succesfully fetched')
          callback(null, {entities: entities.map((entity) => entity.toJson())})
        } catch (err) {
          this.logger.info({reason: err.message}, 'Could not fetch entities')
          callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: err.message
          })
        }
      },
      getEntity: async (call, callback) => {
        try {
          this.logger.info('Fetching entity')
          const {parent, entityId} = call.request
          const entity = await this.db.entities.findOne(parent.assistantId, parent.skillsetId, entityId)
          this.logger.info('Entity succesfully fetched')
          callback(null, entity.toJson())
        } catch (err) {
          this.logger.error({reason: err.message}, 'Could not fetch entity')
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