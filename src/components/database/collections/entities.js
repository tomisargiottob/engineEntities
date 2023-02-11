import { v4 as uuid } from 'uuid'
import errors from 'common-errors'
import Entity from '../models/entity'

class Entities {
  constructor({db}) {
    this.db = db;
    this.collection= this.db.collection('entities')
  }

  async create(entityData) {
    entityData.createdAt = Date.now()
    const entity = await this.collection.insertOne({_id: uuid(), ...entityData});
    const createdEntity = await this.collection.findOne({_id:entity.insertedId})
    return new Entity(this.collection, createdEntity)
  }

  async getAll(assistantId, skillsetId) {
    const entities = await this.collection.find({assistantId, skillsetId}).toArray();
    return entities.map((entity) => new Entity(this.collection,entity))
  }

  async findOne(assistantId, skillsetId, entityId) {
    const entity = await this.collection.findOne({assistantId, skillsetId, _id:entityId});
    if(!entity) {
      throw errors.NotFoundError('Entity not found')
    }
    return new Entity(this.collection,entity)
  }

}

export default Entities