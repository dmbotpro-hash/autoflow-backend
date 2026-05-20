import { Logger } from '@nestjs/common';

const logger = new Logger('RetrySystem');

/**
 * Executes an operation with exponential backoff retry.
 * Formula for delay: baseDelayMs * (2 ^ attempt)
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 2000,
): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= maxRetries) {
        throw error;
      }
      const delay = baseDelayMs * Math.pow(2, attempt);
      logger.warn(
        `[Retry System] Attempt ${attempt + 1} failed, retrying in ${delay}ms... Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
    }
  }
}
