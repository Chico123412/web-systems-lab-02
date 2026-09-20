import type { IUser } from "./interfaces/IUser";

export class User implements IUser {
  private readonly _id: string;
  private _name: string;
  private _email: string;
  private _borrowedBookIds: string[];

  constructor(
    id: string,
    name: string,
    email: string,
    borrowedBookIds: string[] = []
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._borrowedBookIds = [...borrowedBookIds];
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get borrowedBookIds(): readonly string[] {
    return [...this._borrowedBookIds];
  }

  addBorrowedBook(bookId: string): void {
    if (this._borrowedBookIds.includes(bookId)) {
      throw new Error("Користувач уже позичив цю книгу");
    }

    if (this._borrowedBookIds.length >= 3) {
      throw new Error("Користувач не може позичити більше трьох книг");
    }

    this._borrowedBookIds.push(bookId);
  }

  removeBorrowedBook(bookId: string): void {
    const bookIndex = this._borrowedBookIds.indexOf(bookId);

    if (bookIndex === -1) {
      throw new Error("Ця книга не належить до позичених користувачем");
    }

    this._borrowedBookIds.splice(bookIndex, 1);
  }
}
