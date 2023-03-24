const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
});

server.listen(3002, () => {
    console.log("listening on port:3002");
});

// const client = new Client({
//     authStrategy: new LocalAuth({
//         clientId: "rose",
//         dataPath: "./Sessions",
//     }),
//     puppeteer: {
//         defaultViewport: null,
//         args: [
//             "--start-maximized",
//             "--disable-session-crashed-bubble",
//             "--no-sandbox",
//         ],
//         headless,
//         executablePath: "/usr/bin/google-chrome-stable",
//         // executablePath: "/usr/bin/chromium-browser",
//         // executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
//     },
// });


const { Client, NoAuth, MessageMedia } = require("whatsapp-web.js");

// const { Server } = require("socket.io");

// const io = new Server({
//     cors: {
//         origin: "*",
//     },
// });

// io.on("connection", (socket) => {
//     console.log(`${socket.id} connected`);
// });

// io.listen(3002);

console.log('socket listening on port 3002');

console.log(io.socket);


let vars = {
    all: true,
};

let changeVars = (v) => {
    vars = v;
};

const client = new Client({
    authStrategy: new NoAuth(),
    puppeteer: {
        defaultViewport: null,
        args: [
            "--start-maximized",
            "--disable-session-crashed-bubble",
            "--no-sandbox",
        ],
        headless:true,
        executablePath: "/usr/bin/chromium-browser",
        // executablePath: "/usr/bin/google-chrome-stable",
    },
});

//clear Module Caches. Recompile every modules each time they are being 'required'
const clearCache = () => {
    Object.keys(require.cache).forEach(function (key) {
        delete require.cache[key];
    });
};

client.on("qr", (qr) => {
    console.log(`created QR`);
    io.sockets.emit("qr", qr);
});

client.on("ready", async() => {
    io.sockets.emit("ready");

    let sender = await client.getContactById(client.info.wid._serialized);

    console.log(
        `\n --- ${sender.name || sender.pushname} aka ${
            sender.number
        } is ready! ---\n`
    );
});

client.on("auth_failure", (qr) => {
    console.log(
        "\n --- Authentication failed. scan the qr code to login again. --- \n"
    );
});

client.on("authenticated", () => {
    io.sockets.emit("authenticated");
    console.log("Client is authenticated!");
});

client.on("disconnected", () => {
    io.sockets.emit("disconnected");
    console.log("Client is disconnected!");
    setTimeout(()=>{
        io.sockets.emit("loading");
        console.log("Reinitializing client");
        client.initialize()
    },3500)
});


client.on("message_create", async (msg) => {
    clearCache();

    await require("./caller")(client, msg, MessageMedia, vars, changeVars);
});

// client.initialize();

// console.log("initializing client");


