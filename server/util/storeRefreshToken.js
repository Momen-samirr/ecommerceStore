import redis from "../libraries/redis.js";

const storeRefreshToken = async (userId, refreshToken) => {
  redis.set(
    `refreshToken: ${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 * 1000
  );
};

export default storeRefreshToken;
