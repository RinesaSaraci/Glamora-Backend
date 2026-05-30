const getRedis = require("./redis");

const get = async (key) => {
  try {
    const data = await getRedis().get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const set = async (key, value, ttlSeconds = 60) => {
  try {
    await getRedis().set(key, JSON.stringify(value), { ex: ttlSeconds });
  } catch {
    // cache failure nuk duhet të prishë request-in
  }
};

const del = async (...keys) => {
  try {
    await getRedis().del(...keys);
  } catch {}
};

module.exports = { get, set, del };
