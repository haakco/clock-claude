import { configure, getConsoleSink, getLogger } from '@logtape/logtape';

const isDev = import.meta.env.DEV;

/**
 * Initialize LogTape - call once at app startup
 */
export async function initializeLogger(): Promise<void> {
  await configure({
    sinks: {
      console: getConsoleSink(),
    },
    loggers: [
      {
        category: ['clock-claude'],
        lowestLevel: isDev ? 'debug' : 'error',
        sinks: ['console'],
      },
    ],
  });
}

/**
 * Get a logger for a specific module
 * @param module - Module name (e.g., 'error-boundary', 'tts')
 */
export function getAppLogger(module: string) {
  return getLogger(['clock-claude', module]);
}

/**
 * Root app logger
 */
export const logger = getLogger(['clock-claude']);
