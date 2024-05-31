const httpServer = require("http").createServer();
// const Redis = require("ioredis");
const {Database} = require("arangojs");

// const {AuthDataValidator} = require('@telegram-auth/server');
// const {urlStrToAuthDataMap} = require('@telegram-auth/server/utils');


// const redisClient = new Redis();

const db = new Database({
    url: "http://45.80.70.119:8529",
    databaseName: "brobot",
    auth: {
        username: "root",
        password: "rootpassword"
    },
});


const io = require("socket.io")(httpServer, {
    cors: {
        // origin: "http://localhost:8080",
        // origin: "http://localhost:3001",
        origin: "*",
    },
});

const {setupWorker} = require("@socket.io/sticky");
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const {ArangoDBSessionStore} = require("./sessionStore");
const {ArangoMessageStore} = require("./messageStore");
const {TaskStore} = require("./taskStore");


const sessionStore = new ArangoDBSessionStore(db); // new RedisMessageStore(redisClient);
const messageStore = new ArangoMessageStore(db);

const taskStore = new TaskStore(db);

//
// async function authorize(credentials, req) {
//     const validator = new AuthDataValidator({
//         botToken: `${process.env.BOT_TOKEN}`,
//     });
//
//     const data = objectToAuthDataMap(req.query || {});
//     const user = await validator.validate(data);
//
//     if (user.id && user.first_name) {
//         return {
//             id: user.id.toString(),
//             name: [user.first_name, user.last_name || ''].join(' '),
//             image: user.photo_url,
//         };
//     }
//     return null;
// }
//
// authorize(credentials, req).then((user) => {
//     console.log('##3 ', user)
// });
//

function isAuthDataMismatch(socket) {
    return (
        socket.handshake.auth.hash !== socket.hash &&
        socket.handshake.auth.username !== socket.username
        // || socket.handshake.auth.sessionID !== socket.sessionID
    );
}

io.use(async (socket, next) => {
    console.log('#10.1 ',
        [
            {
                username: socket.handshake.auth.username,
                hash: socket.handshake.auth.hash,
                sessionID:  socket.handshake.auth.sessionID,
                newUser: socket.handshake.auth.newUser

            }]
    );

    const username = socket.handshake.auth.username;
    const sessionID = socket.handshake.auth.sessionID;
    const newUser = socket.handshake.auth.newUser;

    if (sessionID) {
        const session = await sessionStore.findSession(sessionID);
        console.log('#10.3  if (sessionID) ', session);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.username = session.username;
            socket.hash = session.hash;
            socket.status = true;
            return next();
        }
    }
    else if (username && !sessionID ) {
        const session = await sessionStore.findUserByUsername(username);
        console.log('#10.4  else if (username && !sessionID ) ', session);
        if (session) {
            socket.handshake.auth.sessionID = session.sessionID;
            socket.sessionID = session.sessionID;
            socket.userID = session.userID;
            socket.username = session.username;
            socket.hash = session.hash;
            socket.status = true;
            return next();
        }
        else if (newUser) {
            socket.sessionID = randomId();
            socket.userID = randomId();
            socket.username = username;
            socket.hash = socket.handshake.auth.hash;
            socket.status = false;
            return next();
        }
        else {
            console.log('#10.4  else {  ', "invalid username");
            socket.status = false;
            return next(new Error("invalid username"));
        }
    }
    if (!username) {
        return next(new Error("invalid username"));
    }


});

io.on("connection", async (socket) => {

    // TODO auth 4) send the session ID to the client
    // TODO auth 5) the client sends the session ID8er sends the user data to the client
    // TODO auth 8) the client sends a message to the server
    // TODO auth 9) the server forwards the message to the recipient

    // TODO auth 10) the recipient receives the message
    // TODO auth 11) the recipient sends a response to the server


    // TODO auth 1) get auth data from the client
    console.log('#10.2 username', socket.handshake.auth.username, socket.username);
    console.log('#10.3 hash', socket.handshake.auth.hash, socket.hash);
    console.log('#10.3 sessionID', socket.handshake.auth.sessionID, socket.sessionID);
    console.log('#10.3 condition', (isAuthDataMismatch(socket)) );

    //  TODO auth 4) if a new user is connected, connect an old session
    if (!isAuthDataMismatch(socket)) {
        console.log('#10.4' , 'this user the no connect')
        // check login

        // check password
        //  TODO auth 5) connect old user


        // else create new user
        // TODO auth 6) creating new session and user

    }





    // TODO: check if the password is correct
    // TODO auth 2) validate the auth data
    if (isAuthDataMismatch(socket)) {
        socket.emit('authentication_error', 'Invalid password');
        console.log('#10.2.1 authentication_error  Invalid password', socket.handshake.auth.hash, socket.hash);
        console.log('#10.2.2 authentication_error  Invalid password', socket.sessionID);
        // TODO auth 3) if the auth data is valid, block the user
        // sessionStore.saveSession(socket.sessionID, {
        //     userID: socket.userID,
        //     username: socket.username,
        //     connected: false,
        //     hash: socket.hash,
        // });
        socket.disconnect();
    } else {
        // persist session
        sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            username: socket.username,
            connected: true,
            hash: socket.hash,
        });

        // ==========  SESSION BLOCK ===========
        // emit session details
        socket.emit("session", {
            sessionID: socket.sessionID,
            userID: socket.userID,
            username: socket.username,
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

        // ==========  USER BLOCK ===========
        socket.emit("users", users);

        // notify existing users
        socket.broadcast.emit("user connected", {
            userID: socket.userID,
            username: socket.username,
            connected: true,
            messages: [],
        });


        // ========== MASSAGE BLOCK =============
        // forward the private message to the right recipient (and to other tabs of the sender)
        socket.on("private message", ({content, to}) => {
            console.log('#8', [{
                content: content,
                from: socket.userID,
                to: to
            }])
            const message = {
                content,
                from: socket.userID,
                to,
            };
            socket.to(to).to(socket.userID).emit("private message", message);
            messageStore.saveMessage(message);
        });

        // ========== TASK BLOCK =============

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

        await responseTaskForUser(socket);

    }
    // notify users upon disconnection
    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // notify other users
            socket.broadcast.emit("user disconnected", socket.userID);
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
