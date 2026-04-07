import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import helmet from "helmet";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.PORT;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const MAIN_SERVICE_URL = process.env.MAIN_SERVICE_URL;
const NOTIFICATIONS_SERVICE_URL = process.env.NOTIFICATIONS_SERVICE_URL;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet());

app.use("/api/auth", createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' },
  proxyTimeout: 0,
  timeout: 0,
  on: {
    proxyReq: (proxyReq, req: any, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    error: (err, req, res: any) => {
      console.error('Proxy error:', err);
      res.status(500).json({ error: err.message });
    }
  }
}));

app.use("/api/main", createProxyMiddleware({
  target: MAIN_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/main': '' },
  proxyTimeout: 0,
  timeout: 0,
  on: {
    proxyReq: (proxyReq, req: any, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    error: (err, req, res: any) => {
      console.error('Proxy error on main:', err);
      res.status(500).json({ error: err.message });
    }
  }
}));

app.use("/api/notification", createProxyMiddleware({
  target: NOTIFICATIONS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/notification': '' },
  proxyTimeout: 0,
  timeout: 0,
  on: {
    proxyReq: (proxyReq, req: any, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    error: (err, req, res: any) => {
      console.error('Proxy error:', err);
      res.status(500).json({ error: err.message });
    }
  }
}));

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "api-gateway" });
});

app.listen(port, () => {
  console.log(`🚀 Gateway sur port ${port}`);
  console.log(`→ Auth: ${AUTH_SERVICE_URL}`);
  console.log(`→ Main: ${MAIN_SERVICE_URL}`);
  console.log(`→ Notification: ${NOTIFICATIONS_SERVICE_URL}`);
});