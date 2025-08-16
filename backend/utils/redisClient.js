const { createClient } = require("redis");

let client;

async function connectRedis() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    client.on("error", (err) => console.error("❌ Redis Error:", err));
    client.on("connect", () => console.log("✅ Redis connected"));

    await client.connect();
  }
  return client;
}

// Export a promise that resolves to the client
module.exports = connectRedis();
