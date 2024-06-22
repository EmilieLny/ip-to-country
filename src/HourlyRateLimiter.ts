export class HourlyRateLimiter {
  private counter: number = 0;
  private timestamp: Date | null = null;
  constructor(private maxCounter: number) {}

  private get isExpired(): boolean {
    const hourInMilliseconds = 60 * 60 * 1000;
    return (
      !this.timestamp ||
      Date.now() - this.timestamp.getTime() > hourInMilliseconds
    );
  }

  increaseCounter(): void {
    if (this.isExpired) {
      this.counter = 0;
      this.timestamp = new Date();
    }
    this.counter++;
  }

  get isRateLimited(): boolean {
    if (!this.timestamp) return false;
    if (Date.now() - this.timestamp.getTime() > 60 * 60 * 1000) {
      return false;
    }
    return this.counter >= this.maxCounter;
  }
}
