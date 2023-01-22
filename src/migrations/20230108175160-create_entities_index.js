export const up = async (db) => {
  await db.collection('entities').createIndex({name: 1, assistantId: 1, skillsetId:1}, {unique: true});
};

export const down = async (db) => {
  await db.collection('entities').dropIndex('name');
};
