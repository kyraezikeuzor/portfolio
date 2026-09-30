export default class Logger {
  constructor(
    private level: 'debug' | 'info' | 'error' | 'none',
    private scope = 'portfolio'
  ) {}

  debug(message: string, ...args: unknown[]) {
    if (this.level === 'debug') {
      console.debug(`[${this.scope}] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]) {
    if (this.level === 'debug' || this.level === 'info') {
      console.info(`[${this.scope}] ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]) {
    if (this.level !== 'none') {
      console.error(`[${this.scope}] ${message}`, ...args);
    }
  }
}
