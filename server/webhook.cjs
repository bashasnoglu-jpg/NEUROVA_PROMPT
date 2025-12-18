function parseIncoming(req) {
  if (req.is("application/json") && req.body && typeof req.body === "object") {
    return { mode: "json", data: req.body };
  }
  const payload = (req.body && req.body.payload) || (req.query && req.query.payload);
  if (typeof payload === "string" && payload.length) {
    return { mode: "form-payload", data: JSON.parse(payload) };
  }
  if (typeof req.body === "string" && req.body.length) {
    const txt = req.body.trim();
    if (txt.startsWith("{") || txt.startsWith("[")) {
      return { mode: "raw-json", data: JSON.parse(txt) };
    }
    const qs = new URLSearchParams(txt);
    const payloadEnc = qs.get("payload");
    if (payloadEnc) {
      const decoded = decodeURIComponent(payloadEnc);
      return { mode: "raw-form", data: JSON.parse(decoded) };
    }
  }
  throw new Error("No JSON body or payload found");
}
function webhookHandler(req, res) {
  try {
    const parsed = parseIncoming(req);
    return res.json({ ok: true, mode: parsed.mode });
  } catch (e) {
    return res.status(400).json({ ok: false, err: String(e) });
  }
}
module.exports = { parseIncoming, webhookHandler };
