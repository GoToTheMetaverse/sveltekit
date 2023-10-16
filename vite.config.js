import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
// import { ViteDevServer } from "vite";
import { WebSocketServer } from "ws";
// import {
//   createWSSGlobalInstance,
//   onHttpServerUpgrade,
// } from "./src/lib/server/webSocketUtils";

let wss = null;
const webSocketServer = {
  name: "webSocketServer ",
  configureServer: (server) => {
    if (!server.httpServer) return;

    console.log("configureServer");

    let uid = 0;
    wss = new WebSocketServer({
      noServer: true,
    });
    wss.on("connection", (client) => {
      client.socketId = uid++;
      console.log("connection", client.socketId);

      client.on("close", () => {
        console.log("close", client.socketId);
      });
      client.on("message", (data) => {
        var req = JSON.parse(data);
        console.log("message", client.socketId, req);

        if (req.cmd == "login") {
          console.log("login proc");
          client.send(
            JSON.stringify({
              cmd: "res_login",
              id: client.socketId,
            })
          );
        }
      });
    });

    server.httpServer?.on("upgrade", onHttpServerUpgrade);
  },
};

const onHttpServerUpgrade = (req, sock, head) => {
  if (req.url != "/websocket") return;
  console.log("onHttpServerUpgrade req.url == websocket");

  wss.handleUpgrade(req, sock, head, (ws) => {
    console.log("handleUpgrade");
    wss.emit("connection", ws, req);
  });
};

export default defineConfig({
  plugins: [
    //
    sveltekit(),
    webSocketServer,
  ],
});
