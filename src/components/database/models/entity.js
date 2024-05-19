class Entity {
  constructor(collection, data) {
    this.id = data._id
    this.name = data.name
    this.description = data.description
    this.collection = collection
    this.matches = data.matches
    this.skillsetId = data.skillsetId
    this.assistantId = data.assistantId
  }

  async update(entityData) {
    const updateData = {}
    if(entityData.matches) {
      updateData.matches = entityData.matches
    }
    if(entityData.name) {
      updateData.name = entityData.name
    }
    if(entityData.description) {
      updateData.description = entityData.description
    }
    return this.collection.updateOne({_id: this.id}, { $set: {...updateData, updatedAt: Date.now()} })
  }

  async remove() {
    return this.collection.deleteOne({_id:this.id})
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      matches: this.matches
    }
  }
}

export default Entity