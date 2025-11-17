exports.handler = async (event) => {
  console.log("Function send-pin has been called!");

  try {
    const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
    const SECRET = process.env.SECRET_PIN_KEY;
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const SENDGRID_FROM = process.env.SENDGRID_FROM;

    console.log("Loaded ENV:", {
      ADMIN_API_KEY: !!ADMIN_API_KEY,
      SECRET: !!SECRET,
      SENDGRID_API_KEY: !!SENDGRID_API_KEY,
      ADMIN_EMAIL,
      SENDGRID_FROM,
    });

    // 🔐 Auth
    const authHeader = event.headers?.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");

    if (!token || token !== ADMIN_API_KEY) {
      console.error("Invalid or missing admin token.");
      return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    // 🔢 Generate PIN
    const generatePin = (secret) => {
      const now = Date.now();
      const period = Math.floor(now / (30 * 60 * 1000));
      const raw = secret + period;

      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        hash = (hash << 5) - hash + raw.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash % 10000).toString().padStart(4, "0");
    };

    const pin = generatePin(SECRET);
    console.log("Generated PIN:", pin);

    const message = `Bonjour Tessy 💄,\n\nVoici votre PIN administrateur actuel : ${pin}\n\nCe code expire dans 30 minutes.\n\n— Tessy's Beauty System`;

    const payload = {
      personalizations: [{ to: [{ email: ADMIN_EMAIL }] }],
      from: { email: SENDGRID_FROM },
      subject: "🔐 Tessy's Beauty — Votre PIN administrateur",
      content: [{ type: "text/plain", value: message }],
    };

    console.log("Sending request to SendGrid...");

    const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("SendGrid response status:", resp.status);

    if (!resp.ok) {
      const txt = await resp.text();
      console.error("SendGrid ERROR:", txt);
      throw new Error(`SendGrid error: ${txt}`);
    }

    console.log("Email sent successfully!");

    return { statusCode: 200, body: JSON.stringify({ success: true, pin }) };
  } catch (err) {
    console.error("Function ERROR:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
