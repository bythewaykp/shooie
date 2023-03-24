"use client";
import io from "socket.io-client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Loader from "lib/loader";

let Page = () => {
    const [socket, setSocket] = useState(null);
    const [val, setVal] = useState(null);
    const [text, setText] = useState("Initializing");
    const [qr, setQr] = useState(null);
    const [loader, setLoader] = useState(true);

    let handler = async () => {
        await fetch("/api/socket");
        setSocket(io());

        // setSocket(io('http://localhost:3002'));
    };

    useEffect(() => {
        handler();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("qr", (qr) => {
                setTimeout(() => {
                    setLoader(false);
                }, 1000);
                setLoader(true);
                setText("Generating QR Code");
                setVal("qr");
                setQr(qr);
            });
            socket.on("loading", () => {
                setLoader(true);
                setText("Restarting");
                setVal(null);
            });
            socket.on("ready", () => {
                setTimeout(() => {
                    setLoader(false);
                    setVal("ready");
                }, 2500);
                setTimeout(() => {
                    setText("Logging you in");
                    setLoader(true);
                }, 1000);
                setQr(null);
            });
            socket.on("authenticated", () => {
                setTimeout(() => {
                    setLoader(false);
                }, 1000);
                setLoader(true);
                setText("Authenticating");
                setVal("authenticated");
            });
            socket.on("disconnected", () => {
                setTimeout(() => {
                    setLoader(false);
                }, 1000);
                setLoader(true);
                setText("Disconnecting the client");

                setVal("disconnected");
                setQr(null);
            });
            socket.on("destroyed", () => {
                setTimeout(() => {
                    setLoader(false);
                }, 1000);
                setLoader(true);
                setText("Destroying the client");

                setVal("destroyed");
                setQr(null);
            });
            socket.on("init-f", (d) => {
                if (d.val == "loading") {
                    setLoader(true);
                    setText("Generating QR Code");
                } else {
                    setTimeout(() => {
                        setLoader(false);
                    }, 1000);
                    setLoader(true);
                    setText("Connecting to the client");
                }
                setVal(d.val);
                setQr(d.qr);
            });
            socket.emit("init");
        }
    }, [socket]);
    return (
        <div className="center">
            {loader ? (
                <div className="fc">
                    <Loader />
                    <div className="text2">{text}</div>
                </div>
            ) : (
                (() => {
                    switch (val) {
                        case "qr":
                            return (
                                <div className="qrbound">
                                    <QRCodeSVG
                                        className="qr"
                                        value={qr}
                                        size={280}
                                    />
                                </div>
                            );
                        case "ready":
                            return <div className="text">Client is ready!</div>;
                        case "disconnected":
                            return (
                                <div className="text">
                                    Client got disconnected!
                                </div>
                            );
                        case "authenticated":
                            return (
                                <div className="text">
                                    Client is authenticated!
                                </div>
                            );

                        case "destroyed":
                            return (
                                <div className="text">
                                    Client was destroyed!
                                </div>
                            );
                    }
                })()
            )}
            {!loader && (val=== "qr" || val=== "ready") && (
                <button
                    className="logout"
                    onClick={(e) => {
                        socket.emit("logout");
                        setLoader(true);
                        setText("Restarting the client");
                    }}
                    onMouseLeave={(e) => e.target.blur()}
                >
                    {val === "qr" ? "Destroy" : "Logout"}
                </button>
            )}
        </div>
    );
};

export default Page;
