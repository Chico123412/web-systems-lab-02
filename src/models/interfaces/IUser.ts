import type { Identifiable } from "../../types";

export interface IUser extends Identifiable {
  name: string;
  email: string;
  readonly borrowedBookIds: readonly string[];

  addBorrowedBook(bookId: string): void;
  removeBorrowedBook(bookId: string): void;
}
