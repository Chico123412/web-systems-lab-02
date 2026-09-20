import type { Identifiable } from "../types";

export class Library<T extends Identifiable> {
  private items: T[];

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  get size(): number {
    return this.items.length;
  }

  getAll(): T[] {
    return [...this.items];
  }

  add(item: T): void {
    const existingItem = this.findById(item.id);

    if (existingItem) {
      throw new Error(`Об'єкт з ID ${item.id} вже існує`);
    }

    this.items.push(item);
  }

  remove(id: string): boolean {
    const itemIndex = this.items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return false;
    }

    this.items.splice(itemIndex, 1);
    return true;
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  search(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  replaceAll(items: T[]): void {
    this.items = [...items];
  }

  clear(): void {
    this.items = [];
  }
}
