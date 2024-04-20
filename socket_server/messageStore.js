/* abstract */ const {aql} = require("arangojs");

class MessageStore {
  saveMessage(message) {}
  findMessagesForUser(userID) {}
}

class InMemoryMessageStore extends MessageStore {
  constructor() {
    super();
    this.messages = [];
  }

  saveMessage(message) {
    this.messages.push(message);
  }

  findMessagesForUser(userID) {
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
}

const CONVERSATION_TTL = 24 * 60 * 60;

class RedisMessageStore extends MessageStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }

  saveMessage(message) {
    const value = JSON.stringify(message);
    this.redisClient
      .multi()
      .rpush(`messages:${message.from}`, value)
      .rpush(`messages:${message.to}`, value)
      .expire(`messages:${message.from}`, CONVERSATION_TTL)
      .expire(`messages:${message.to}`, CONVERSATION_TTL)
      .exec();
  }

  findMessagesForUser(userID) {
    return this.redisClient
      .lrange(`messages:${userID}`, 0, -1)
      .then((results) => {
        return results.map((result) => JSON.parse(result));
      });
  }
}
class ArangoMessageStore extends MessageStore {
  constructor(db) {
    super();
    this.db = db;
    this.collection = this.db.collection('messages');
  }

  async saveMessage(message) {

    const keyFrom = `messages:${message.from}`;
    const keyTo = `messages:${message.to}`;

    // Получить текущий документ для отправителя и получателя
    const docFrom = await this.collection.documentExists(keyFrom) ? await this.collection.document(keyFrom) : { _key: keyFrom, value: [] };
    const docTo = await this.collection.documentExists(keyTo) ? await this.collection.document(keyTo) : { _key: keyTo, value: [] };

    // Добавить новое сообщение в массив сообщений
    docFrom.value.push(message);
    docTo.value.push(message);

    // Сохранить обновленные документы
    await this.collection.save(docFrom, { overwrite: true });
    await this.collection.save(docTo, { overwrite: true });
  }

  async findMessagesForUser(userID) {
    const cursor = await this.db.query(aql`
      FOR doc IN ${this.collection}
      FILTER doc._key == ${`messages:${userID}`}
      RETURN doc.value
    `);
    const results = await cursor.all();
    return results.flat() ;
  }
}

module.exports = {
  InMemoryMessageStore,
  RedisMessageStore,
  ArangoMessageStore,
};
