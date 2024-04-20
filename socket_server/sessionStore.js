/* abstract */
class SessionStore {
    findSession(id) {
    }

    saveSession(id, session) {
    }

    findAllSessions() {
    }
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
const mapSessionConnect = ([userID, username, connected]) => {
    return userID ? {userID, username, connected: connected === "true"} : undefined;
}
const mapSession = ([userID, username, connected]) => {
    return userID ? {userID, username, connected: connected} : undefined;
}

class RedisSessionStore extends SessionStore {
    constructor(redisClient) {
        super();
        this.redisClient = redisClient;
    }

    findSession(id) {
        return this.redisClient
            .hmget(`session:${id}`, "userID", "username", "connected")
            .then(mapSessionConnect);
    }

    saveSession(id, {userID, username, connected}) {
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
            nextIndex = parseInt(nextIndexAsStr, 10);
            results.forEach((s) => keys.add(s));
        } while (nextIndex !== 0);
        const commands = [];
        keys.forEach((key) => {
            commands.push(["hmget", key, "userID", "username", "connected"]);
        });

        return this.redisClient
            .multi(commands)
            .exec()
            .then((results) => {
                return results
                    .map(([err, session]) => (err ? undefined : mapSessionConnect(session)))
                    .filter((v) => !!v);
            });
    }
}


class ArangoDBSessionStore extends SessionStore {
    constructor(db) {
        super();
        this.db = db;
    }

    findSession(id) {
        const collection = this.db.collection("sessions");
        return collection.document(id)
            .then((doc) => {
                return mapSessionConnect([doc.userID, doc.username, doc.connected]);
            })
            .catch((err) => {
                console.error(err.message);
                return null;
            });
    }


    saveSession(id, {userID, username, connected}) {
        const collection = this.db.collection('sessions');
        return collection.documentExists(id)
            .then((exists) => {
                if (exists) {
                    // If the document exists, update it
                    return collection.update( id, {userID, username, connected});
                } else {
                    // If the document does not exist, create it
                    return collection.save({_key: id, userID, username, connected});
                }
            })
            .then((result) => {
                return result;
            });
    }

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
