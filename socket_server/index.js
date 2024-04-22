const httpServer = require("http").createServer();
// const Redis = require("ioredis");
const {Database, aql} = require("arangojs");

// const redisClient = new Redis();

const db = new Database({
    url: "http://45.80.70.119:8529",
    databaseName: "brobot",
    auth: {
        username: "root",
        password: "rootpassword"
    },
});



const io = require("socket.io")( httpServer, {
    cors: {
        // origin: "http://localhost:8080",
        // origin: "http://localhost:3001",
        origin: "*",
    },
    // adapter: require("socket.io-redis")({
    //     pubClient: redisClient,
    //     subClient: redisClient.duplicate(),
    // }),
});

const {setupWorker} = require("@socket.io/sticky");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { ArangoDBSessionStore, RedisSessionStore } = require("./sessionStore");
const { ArangoMessageStore, RedisMessageStore } = require("./messageStore");
const { TaskStore } = require("./taskStore");


const sessionStore  = new ArangoDBSessionStore(db); // new RedisMessageStore(redisClient);
const messageStore = new ArangoMessageStore(db);
// const messageStore = new RedisMessageStore(redisClient);
// const sessionStore = new RedisSessionStore(redisClient);
const taskStore = new TaskStore(db);


io.use(async (socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        const session = await sessionStore.findSession(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.username = session.username;
            return next();
        }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("invalid username"));
    }
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    next();
});

io.on("connection", async (socket) => {
    // persist session
    sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: true,
    });

    // emit session details
    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });

    // join the "userID" room
    socket.join(socket.userID);

    // fetch existing users
    const users = [];
    const [messages, sessions] = await Promise.all([
        messageStore.findMessagesForUser(socket.userID),
        sessionStore.findAllSessions(),
    ]);
    const messagesPerUser = new Map();
    messages.forEach((message) => {
        const {from, to} = message;
        const otherUser = socket.userID === from ? to : from;
        if (messagesPerUser.has(otherUser)) {
            messagesPerUser.get(otherUser).push(message);
        } else {
            messagesPerUser.set(otherUser, [message]);
        }
    });
    sessions.forEach((session) => {
        users.push({
            userID: session.userID,
            username: session.username,
            connected: session.connected,
            messages: messagesPerUser.get(session.userID) || [],
        });
    });

    socket.emit("users", users);

    // notify existing users
    socket.broadcast.emit("user connected", {
        userID: socket.userID,
        username: socket.username,
        connected: true,
        messages: [],
    });

    // forward the private message to the right recipient (and to other tabs of the sender)
    socket.on("private message", ({content, to}) => {
        const message = {
            content,
            from: socket.userID,
            to,
        };
        socket.to(to).to(socket.userID).emit( "private message", message);
        messageStore.saveMessage(message);
    });

    const responseTaskForUser = async (socket) => {
        try {
            const cursor = await taskStore.findTasksForUser(socket.userID);
            console.log("#7 new task", cursor);
            socket.emit("tasks", cursor);
        } catch (error) {
            console.error("Error getting tasks for user:", error);
        }
    }

    socket.on("new task", async (task) => {
        console.log("#7 new task", task);
        try {
            await taskStore.saveTask(task);
            await responseTaskForUser(socket);
        } catch (error) {
            console.error("Error saving new task:", error);
        }
    });

    responseTaskForUser(socket);

    // notify users upon disconnection
    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // notify other users
            socket.broadcast.emit("user disconnected", socket.userID );
            // update the connection status of the session
            sessionStore.saveSession(socket.sessionID, {
                userID: socket.userID,
                username: socket.username,
                connected: false,
            });
        }
    });
});

setupWorker(io);
