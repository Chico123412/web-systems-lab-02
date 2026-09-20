export class Storage {
  private readonly prefix = "library-app";

  save<T>(key: string, value: T): void {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(this.createKey(key), serializedValue);
  }

  load<T>(key: string): T | null {
    const serializedValue = localStorage.getItem(this.createKey(key));

    if (serializedValue === null) {
      return null;
    }

    try {
      return JSON.parse(serializedValue) as T;
    } catch {
      this.remove(key);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.createKey(key));
  }

  clear(): void {
    const applicationKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith(`${this.prefix}:`)
    );

    applicationKeys.forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  private createKey(key: string): string {
    return `${this.prefix}:${key}`;
  }
}
