/* abstract */ const {aql} = require("arangojs");

class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

const SESSION_TTL = 24 * 60 * 60;



const mapSessionConnect = ([sessionID, userID, username, connected, hash]) => {
  console.log("#1 mapSessionConnect input", [userID, username, connected, hash]);

    const result =
        sessionID ? { sessionID, userID, username, connected: connected === "true", hash } :
            userID ? { userID, username, connected: connected === "true", hash } :
                undefined;
    console.log("#1 mapSessionConnect output", result);
 return result;
}



const mapSession = ([userID, username, connected]) => {
  console.log("#1 redisClient input", [userID, username, connected]);

  var result = userID? { userID, username, connected: connected } : undefined;
  console.log("#1 redisClient output", result);
 return result;
}




class RedisSessionStore extends SessionStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }

  findSession(id) {

let test = this.redisClient
    .hmget(`session:${id}`, "userID", "username", "connected")
    .then(mapSessionConnect);
    console.log('#1  '+Date.now()+' redisClient', test);
    return test
  }

  saveSession(id, { userID, username, connected }) {
    this.redisClient
      .multi()
      .hset(
        `session:${id}`,
        "userID",
        userID,
        "username",
        username,
        "connected",
        connected
      )
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }

  async findAllSessions() {
    const keys = new Set();
    let nextIndex = 0;
    do {
      const [nextIndexAsStr, results] = await this.redisClient.scan(
        nextIndex,
        "MATCH",
        "session:*",
        "COUNT",
        "100"
      );
      nextIndex = parseInt( nextIndexAsStr, 10);
      results.forEach((s) => keys.add(s));
    } while (nextIndex !== 0);
    const commands = [];
    keys.forEach((key) => {
      commands.push(["hmget", key, "userID", "username", "connected"]);
    });
   const results = this.redisClient
      .multi(commands)
      .exec()
      .then((results) => {
        console.log('#1 findAllSessions', results);
        return results
          .map(([err, session]) => (err ? undefined : mapSessionConnect(session)))
          .filter((v) => !!v);
      });
    console.log('#1.1 '+Date.now()+' findAllSessions commands', commands);
    return results;
  }
}


class ArangoDBSessionStore extends SessionStore {
  constructor(db) {
    super();
    this.db = db;
  }

  findSession(id) {
    console.log('#1 '+Date.now()+' sessionID = ', id);
    const collection = this.db.collection("sessions");
    return collection.document(id)
        .then((doc) => {
          console.log('#1 '+Date.now()+' db.collection', doc);
          console.log('#1.2 '+Date.now()+' db.collection', doc.hash);
          return mapSessionConnect([doc._key, doc.userID, doc.username, doc.connected, doc.hash ]);
        })
        .catch((err) => {
          console.error(err.message);
          return null;
        });
  }

  findUserByUsername(username) {
    console.log('#1 '+Date.now()+' username = ', username);
      const query = aql`
        FOR user IN sessions
        FILTER user.username == ${username}
        RETURN user
    `;
      return this.db.query(query)
          .then(cursor => cursor.next())
          .then(user => mapSessionConnect([user._key, user.userID, user.username, user.connected, user.hash]))
          .catch(err => {
              console.error(err.message);
              return null;
          });
  }


  saveSession(id, { userID, username, connected, hash}) {

    console.log('#3 '+Date.now()+' saveSession', [ id , { userID, username, connected, hash }]);

    const collection = this.db.collection('sessions');
    return collection.documentExists(id)
        .then((exists) => {
          if (exists) {
            // If the document exists, update it
            return collection.update(id, { userID, username, connected });
          } else {
            // If the document does not exist, create it
            return collection.save({ _key: id, userID, username, connected, hash });
          }
        })
        .then();
  }
// [TODO: 1.1.1] Реализуйте метод findAllSessions для друзей из ArangoDB]]
  async findAllSessions() {
    // Определяем модель для коллекции "sessions"
    const sessions = this.db.collection('sessions');
    return sessions.all()
        .then(cursor => cursor.all())
        .then(docs => {
          // Обработка полученных документов
          return docs.map(doc => mapSession([doc.userID, doc.username, doc.connected]));
        })
        .catch(err => {
          // Обработка ошибок, если таковые возникли
          console.error('Failed to fetch documents:', err);
        });
  }
}


module.exports = {
  InMemorySessionStore,
  RedisSessionStore,
  ArangoDBSessionStore,
};
