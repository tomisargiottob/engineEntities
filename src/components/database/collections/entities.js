import { v4 as uuid } from 'uuid'
import Entity from '../models/entity'

class Entities {
  constructor({db}) {
    this.db = db;
    this.collection= this.db.collection('entities')
  }

  async create(entityData) {
    const entity = await this.collection.insertOne({_id: uuid(), ...entityData});
    const createdEntity = await this.collection.findOne({_id:entity.insertedId})
    return new Entity(this.collection, createdEntity)
  }

  async getAll(assistantId, skillsetId) {
    const entities = await this.collection.find({assistantId, skillsetId}).toArray();
    console.log(entities, assistantId, skillsetId)
    return entities.map((entity) => new Entity(this.collection,entity))
  }

  async findOne(assistantId, skillsetId, entityId) {
    const entity = await this.collection.findOne({assistantId, skillsetId, _id:entityId});
    return new Entity(this.collection,entity)
  }

}

export default Entities