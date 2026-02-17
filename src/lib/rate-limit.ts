const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export interface RateLimitConfig {
  keyPrefix?: string;

  // Maximum number of requests
  maxRequests: number;

  // Time window in milliseconds
  windowMs: number;

  // Maximum number of retries before failing
  maxRetries?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  // Unix timestamp when the window resets
  resetTime: number;
  // Current number of requests in window
  totalHits: number;

  // Wait for the rate limit to reset,
  // passing a maximum number of retries
  // to avoid infinite recursion
  retry: () => Promise<boolean>;
}

const rateLimitCache = new Map<string, number>();

export const recordRateLimit = async ({windowMs, keyPrefix = 'rate-limit'}: RateLimitConfig) => {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const key = `${keyPrefix}:${windowStart}`;

  const currentCount = rateLimitCache.get(key) ?? 0;
  rateLimitCache.set(key, currentCount + 1);

  // Remember to clean up the cache - example how to do it in redis
  //   const pipeline = redis.pipeline();
  //   pipeline.incr(key);
  //   pipeline.expire(key, Math.ceil(windowMs / 1000));
};

export async function checkRateLimit({
  maxRequests,
  windowMs,
  keyPrefix = 'rate-limit',
  maxRetries = 3,
}: RateLimitConfig): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const key = `${keyPrefix}:${windowStart}`;

  const count = rateLimitCache.get(key) ?? 0;
  const allowed = count < maxRequests;
  const remaining = Math.max(0, maxRequests - count);
  const resetTime = windowStart + windowMs;

  let retryCount = 0;

  const retry = async (): Promise<boolean> => {
    if (!allowed) {
      const waitTime = resetTime - Date.now();
      if (waitTime > 0) {
        await delay(waitTime);
      }

      // Check rate limit again after waiting
      const retryResult = await checkRateLimit({
        maxRequests,
        windowMs,
        keyPrefix,
        maxRetries,
      });

      if (!retryResult.allowed) {
        if (retryCount >= maxRetries) {
          return false;
        }
        retryCount++;
        return await retryResult.retry();
      }
      return true;
    }
    return true;
  };

  return {
    allowed,
    remaining,
    resetTime,
    totalHits: count,
    retry,
  };
}
