import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import path from 'path'
import errors from 'common-errors'
import MatchParser from '../matchParser'

class Server {
  constructor({logger, db}, config) {
    this.db = db;
    this.config = config;
    this.logger = logger.child({module: 'Server'})
    this.identifier = new MatchParser({logger})
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
          const {parent,entityData} = call.request
          this.logger.info('Fetching entity')
          let entity = await this.db.entities.findOne(parent.assistantId, parent.skillsetId, entityData.id)
          await entity.update(entityData)
          entity = await this.db.entities.findOne(parent.assistantId, parent.skillsetId, entityData.id)
          callback(null, entity.toJson())
        } catch (err) {
          if(err instanceof errors.NotFoundError) {
            this.logger.warn('Entity not found')
            callback({
              code: grpc.status.NOT_FOUND,
              message: err.message
            })
          } else {
            callback({
              code: grpc.status.INVALID_ARGUMENT,
              message: err.message
            })
          }
        }
      },
      deleteEntity: async (call, callback) => {
        try {
          this.logger.info('Removing entity')
          const {parent, entityId} = call.request
          const entity = await this.db.entities.findOne(parent.assistantId, parent.skillsetId, entityId)
          await entity.remove()
          callback(null, true)
        } catch (err) {
          if(err instanceof errors.NotFoundError) {
            callback({
              code: grpc.status.NOT_FOUND,
              message: err.message
            })
          } else {
            callback({
              code: grpc.status.INVALID_ARGUMENT,
              message: err.message
            })
          }
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
          const {parent, message} = call.request
          const entities = await this.db.entities.getAll(parent.assistantId, parent.skillsetId)
          this.identifier.matchEntities(entities, message)
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