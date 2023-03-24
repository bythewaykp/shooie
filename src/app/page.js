"use client";
import io from "socket.io-client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Loader from "lib/loader";

let Page = () => {
    const [socket, setSocket] = useState(null);
    const [val, setVal] = useState(null);
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
                }, 500);
                setLoader(true);
                setVal("qr");
                setQr(qr);
            });
            socket.on("loading", () => {
                setLoader(true);
                setVal(null);
            });
            socket.on("ready", () => {
                setTimeout(() => {
                    setLoader(false);
                }, 1500);
                setLoader(true);
                setQr(null);
                setVal("ready");
            });
            socket.on("authenticated", () => {
                setTimeout(() => {
                    setLoader(false);
                }, 1000);
                setLoader(true);
                setVal("authenticated");
            });
            socket.on("disconnected", () => {
                setTimeout(() => {
                    setLoader(false);
                }, 1500);
                setLoader(true);

                setQr(null);
                setVal("disconnected");
            });
            socket.on('init-f', (d) => {
                if(d.val=='loading'){
                    setLoader(true)
                }
                else{
                    setLoader(false);
                }
                setVal(d.val);
                setQr(d.qr);
            });
            socket.emit('init')
        }
    }, [socket]);
    return (
        <div className="center">
            {loader ? (
                <Loader />
            ) : (
                (() => {
                    switch (val) {
                        case "qr":
                            return <div className="qrbound"><QRCodeSVG className="qr" value={qr} size={280} /></div>;
                        case "ready":
                            return <div className="text">Client is ready!</div>;
                        case "disconnected":
                            return <div className="text">Client got disconnected!</div>;
                        case "authenticated":
                            return <div className="text">Client is authenticated!</div>;
                    }
                })()
            )}
        </div>
    );
};

export default Page;
