exports.handler = async (event) => {
  // 🔐 Chanje sa a pou yon kle sekrè pwòp ou
  const SECRET = "TESSY_PRIVATE_KEY_2025"; 

  // Kalkile "block" 30 min
  const now = Date.now();
  const period = Math.floor(now / (30 * 60 * 1000)); 
  const raw = SECRET + period;

  // Hash senp pou jenere PIN
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }

  const pin = Math.abs(hash % 10000).toString().padStart(4, "0");

  return {
    statusCode: 200,
    body: JSON.stringify({ pin }),
  };
};
