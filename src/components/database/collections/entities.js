class Entities {
  constructor({db}) {
    this.db = db;
    this.collection= this.db.collection('assistants')
  }
}

export default Entities