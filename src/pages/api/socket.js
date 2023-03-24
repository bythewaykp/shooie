import { Server } from "socket.io";
const { Client, NoAuth, MessageMedia } = require("whatsapp-web.js");

let Socket = (req, res) => {
    if (res.socket.server.io) {
        // console.log("Socket is already running");
    } else {
        console.log("Socket is initializing");

        let d = {
            val: "loading",
            qr: null,
        };

        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        const client = new Client({
            authStrategy: new NoAuth(),
            puppeteer: {
                defaultViewport: null,
                args: [
                    "--start-maximized",
                    "--disable-session-crashed-bubble",
                    "--no-sandbox",
                ],
                headless: true,
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
            d.val = "qr";
            d.qr = qr;
        });

        client.on("ready", async () => {
            io.sockets.emit("ready");

            let sender = await client.getContactById(
                client.info.wid._serialized
            );

            console.log(
                `\n --- ${sender.name || sender.pushname} aka ${
                    sender.number
                } is ready! ---\n`
            );
            d.val = "ready";
            d.qr = null;
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
            d.val = "disconnected";
            d.qr = null;
            setTimeout(() => {
                d.val = "loading";
                io.sockets.emit("loading");
                console.log("Reinitializing client");
                client.initialize();
            }, 3500);
        });

        client.on("message_create", async (msg) => {
            clearCache();

            await require("../../../caller")(
                client,
                msg,
                MessageMedia,
                vars,
                changeVars
            );
        });

        client.initialize();
        console.log("initializing client");

        io.on("connection", (socket) => {
            console.log(`new user ${socket.id} connected`);
            socket.on("init", () => {
                socket.emit("init-f", d);
            });
            socket.on("logout", () => {
                client.destroy();
                console.log("destroying client client");
                d.val = "loading";
                io.sockets.emit("loading");
                client.initialize();
            });
        });
    }
    res.end();
};

export default Socket;
