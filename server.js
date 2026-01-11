const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3005;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    // Büyük dosya yüklemeleri için body size limitini artır (500MB)
    req.setTimeout(300000); // 5 dakika timeout
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  
  // HTTP server için max body size ayarı
  httpServer.maxHeadersCount = 2000;

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    }
  });

  global.io = io;

  io.on("connection", (socket) => {
    const deviceId = socket.handshake.query.deviceId;
    if (deviceId) {
      socket.join(deviceId);
      console.log(`> [Socket] Cihaz bağlandı: ${deviceId}`);
    }
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error("Sunucu başlatılamadı:", err);
  process.exit(1);
});