import type { Identifiable } from "../../types";

export interface IBook extends Identifiable {
  title: string;
  author: string;
  publicationYear: number;
  readonly isBorrowed: boolean;
  readonly borrowedByUserId: string | null;

  borrow(userId: string): void;
  returnBook(): void;
}
