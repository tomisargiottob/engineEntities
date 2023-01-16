class Entity {
  constructor(collection, data) {
    this.id = data.id
    this.name = data.name
    this.collection = collection
  }
}

export default Entity