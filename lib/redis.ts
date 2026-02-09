import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache time
const CACHE_TTL = {
  PROJECT_LIST: 60 * 10, // 10 minutes
  PROJECT_DETAIL: 60 * 5, // 5 minutes
};

// Project List Caching
export async function getCachedProjectList(userId: string) {
  try {
    const key = `user:${userId}:projects`;
    const cached = await redis.get(key);
    return cached;
  } catch (error) {
    console.error("Error getting cached project list:", error);
    return null;
  }
}

export async function setCachedProjectList(userId: string, projects: unknown) {
  try {
    const key = `user:${userId}:projects`;
    await redis.setex(key, CACHE_TTL.PROJECT_LIST, projects);
  } catch (error) {
    console.error("Error setting cached project list:", error);
  }
}

// Project Detail Caching
export async function getCachedProjectDetail(projectId: string) {
  try {
    const key = `project:${projectId}`;
    const cached = await redis.get(key);
    return cached;
  } catch (error) {
    console.error("Error getting cached project detail:", error);
    return null;
  }
}

export async function setCachedProjectDetail(
  projectId: string,
  project: unknown
) {
  try {
    const key = `project:${projectId}`;
    await redis.setex(key, CACHE_TTL.PROJECT_DETAIL, project);
  } catch (error) {
    console.error("Error setting cached project detail:", error);
  }
}

// Cache Invalidation
export async function invalidateProjectCache(
  userId: string,
  projectId?: string
) {
  try {
    const keys = [`user:${userId}:projects`];
    if (projectId) keys.push(`project:${projectId}`);

    await Promise.all(keys.map((key) => redis.del(key)));
  } catch (error) {
    console.error("Error invalidating project cache:", error);
  }
}

export default redis;
