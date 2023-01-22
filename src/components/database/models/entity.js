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
    if(entityData.synonyms) {
      updateData.synonyms = entityData.synonyms
    }
    if(entityData.name) {
      updateData.name = entityData.name
    }
    if(entityData.regex) {
      updateData.regex = entityData.regex
    }
    return this.collection.update(this.id, { $set: updateData})
  }

  async remove() {
    return this.collection.remove(this.id)
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