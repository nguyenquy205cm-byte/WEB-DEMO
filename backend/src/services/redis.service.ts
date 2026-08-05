import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export const connect = async () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.log("REDIS_URL not set — skipping Redis connection");
    return;
  }

  try {
    client = createClient({ url });
    client.on("error", (err) => console.error("Redis error", err));
    await client.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Failed to connect Redis:", (err as Error).message);
    client = null;
  }
};

export const isConnected = () => !!client && (client.isOpen ?? false);

export const get = async (key: string): Promise<string | null> => {
  if (!client || !isConnected()) return null;
  try {
    return await client.get(key);
  } catch (err) {
    console.error("Redis GET error", (err as Error).message);
    return null;
  }
};

export const set = async (key: string, value: string, ttlSeconds?: number) => {
  if (!client || !isConnected()) return;
  try {
    if (ttlSeconds) await client.set(key, value, { EX: ttlSeconds });
    else await client.set(key, value);
  } catch (err) {
    console.error("Redis SET error", (err as Error).message);
  }
};

export const del = async (key: string) => {
  if (!client || !isConnected()) return;
  try {
    await client.del(key);
  } catch (err) {
    console.error("Redis DEL error", (err as Error).message);
  }
};

export const deleteByPattern = async (pattern: string) => {
  if (!client || !isConnected()) return;
  try {
    // use scanIterator to avoid blocking
    // eslint-disable-next-line no-unreachable-loop
    for await (const key of client.scanIterator({ MATCH: pattern })) {
      try {
        await client.del(key);
      } catch (err) {
        console.error("Redis DEL (pattern) error", (err as Error).message);
      }
    }
  } catch (err) {
    console.error("Redis scanIterator error", (err as Error).message);
  }
};

export const disconnect = async () => {
  if (!client) return;
  try {
    await client.disconnect();
  } catch (err) {
    console.error("Redis disconnect error", (err as Error).message);
  } finally {
    client = null;
  }
};
