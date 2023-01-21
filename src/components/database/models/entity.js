class Entity {
  constructor(collection, data) {
    this.id = data._id
    this.name = data.name
    this.collection = collection
    this.synonyms = data.synonyms
    this.regex = data.regex
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
}

export default Entity