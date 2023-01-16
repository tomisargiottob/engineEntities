import { MongoClient } from "mongodb";
import Entities from "./collections/entities";

class Database {
  constructor({logger}, config) {
    this.logger = logger.child({module: 'Database'});
    this.client = new MongoClient(config.uri);
    this.config = config
  }

  async connect() {
    await this.client.connect();
    this.logger.info('Successfully connected to database')
    this.db = this.client.db(this.config.dbName);
    this.entities = new Entities({db : this.db})
  }
}

export default Database