const express = require("express");
const path = require("path");
const { webhookHandler } = require("./webhook.cjs");

const app = express();

app.use((req, _res, next) => {
  console.log("[REQ]", req.method, req.url, "ct=", req.headers["content-type"]);
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/webhook", express.text({
  type: (req) => {
    const ct = String(req.headers["content-type"] || "").toLowerCase();
    return !ct.includes("application/json") && !ct.includes("application/x-www-form-urlencoded");
  },
  limit: "1mb",
}));

app.post("/webhook", (req, _res, next) => {
  console.log("[HIT] /webhook", { bodyType: typeof req.body });
  next();
}, webhookHandler);

app.use(
  express.static(path.join(__dirname, ".."), {
    setHeaders(res, servedPath) {
      const p = String(servedPath || "").toLowerCase();
      if (p.endsWith(".html")) res.setHeader("Content-Type", "text/html; charset=utf-8");
      else if (p.endsWith(".css")) res.setHeader("Content-Type", "text/css; charset=utf-8");
      else if (p.endsWith(".js") || p.endsWith(".mjs")) res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      else if (p.endsWith(".json")) res.setHeader("Content-Type", "application/json; charset=utf-8");
      else if (p.endsWith(".svg")) res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    },
  })
);
app.use("/server", (_req, res) => res.status(404).end());

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running: http://localhost:${port}`));
