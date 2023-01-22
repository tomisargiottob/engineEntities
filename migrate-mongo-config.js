import config from 'config';

const configuration = {
  mongodb: {
    url: config.db.uri,

    databaseName: config.db.dbName,

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },

  migrationsDir: "src/migrations",

  changelogCollectionName: "changelog",

  migrationFileExtension: ".js",

  useFileHash: false,

  moduleSystem: 'esm',
};

export default configuration
