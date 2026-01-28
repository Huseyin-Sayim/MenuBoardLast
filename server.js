const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const hostname = dev ? "localhost" : "0.0.0.0";
const port = 3005;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    req.setTimeout(300000);
    const parsedUrl = parse(req.url, true);
    
    // /uploads path'ine gelen istekleri yakala ve dosyaları serve et
    if (parsedUrl.pathname && parsedUrl.pathname.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', parsedUrl.pathname);
      
      // Dosya var mı kontrol et
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('File not found');
          return;
        }
        
        // Content-Type belirle
        const ext = path.extname(filePath).toLowerCase();
        const contentTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.mp4': 'video/mp4',
          '.mov': 'video/quicktime',
          '.avi': 'video/x-msvideo',
          '.mkv': 'video/x-matroska',
          '.webm': 'video/webm'
        };
        const contentType = contentTypes[ext] || 'application/octet-stream';
        
        // Dosyayı oku ve gönder
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading file');
            return;
          }
          
          res.writeHead(200, { 
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000'
          });
          res.end(data);
        });
      });
      return;
    }
    
    handle(req, res, parsedUrl);
  });
  
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