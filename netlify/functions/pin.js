// netlify/functions/pin.js
exports.handler = async (event) => {
  try {
    const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
    const SECRET = process.env.SECRET_PIN_KEY;

    const authHeader = event.headers?.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");

    if (!token || token !== ADMIN_API_KEY) {
      return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    const generatePin = (secret) => {
      const now = Date.now();
      const period = Math.floor(now / (30 * 60 * 1000)); // 30 min block
      const raw = secret + period;

      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        hash = (hash << 5) - hash + raw.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash % 10000).toString().padStart(4, "0");
    };

    const pin = generatePin(SECRET);
    return { statusCode: 200, body: JSON.stringify({ pin }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
