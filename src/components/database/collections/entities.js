import { v4 as uuid } from 'uuid'
import Entity from '../models/entity'

class Entities {
  constructor({db}) {
    this.db = db;
    this.collection= this.db.collection('entities')
  }

  async create(entityData) {
    const entity = await this.collection.insertOne({_id: uuid(), ...entityData});
    return new Entity(entity)
  }

  async getAll(assistantId, skillsetId) {
    const entities = await this.collection.findAll({assistantId, skillsetId});
    return entities.map((entity) => new Entity(entity))
  }

  async findOne(assistantId, skillsetId, entityId) {
    const entity = await this.collection.findOne({assistantId, skillsetId, _id:entityId});
    return new Entity(entity)
  }

}

export default Entities