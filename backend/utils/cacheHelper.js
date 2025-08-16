
const clientPromise = require("./redisClient.js");

async function clearActorCache() {
  const client = await clientPromise;
  const keys = await client.keys("actors:*");
  if (keys.length) {
    await client.del(keys);
    console.log("🧹 Actor cache cleared");
  }
}

module.exports = { clearActorCache };
