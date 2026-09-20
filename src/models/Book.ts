import type { IBook } from "./interfaces/IBook";

export class Book implements IBook {
    private readonly _id: string;
    private _title: string;
    private _author: string;
    private _publicationYear: number;
    private _isBorrowed: boolean;
    private _borrowedByUserId: string | null;

    constructor(
        id: string,
        title: string,
        author: string,
        publicationYear: number,
        isBorrowed = false,
        borrowedByUserId: string | null = null
    ) {
        this._id = id;
        this._title = title;
        this._author = author;
        this._publicationYear = publicationYear;
        this._isBorrowed = isBorrowed;
        this._borrowedByUserId = borrowedByUserId;
    }

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get author(): string {
        return this._author;
    }

    set author(value: string) {
        this._author = value;
    }

    get publicationYear(): number {
        return this._publicationYear;
    }

    set publicationYear(value: number) {
        this._publicationYear = value;
    }

    get isBorrowed(): boolean {
        return this._isBorrowed;
    }

    get borrowedByUserId(): string | null {
        return this._borrowedByUserId;
    }

    borrow(userId: string): void {
        if (this._isBorrowed) {
            throw new Error("Цю книгу вже позичено");
        }

        this._isBorrowed = true;
        this._borrowedByUserId = userId;
    }

    returnBook(): void {
        if (!this._isBorrowed) {
            throw new Error("Ця книга не була позичена");
        }

        this._isBorrowed = false;
        this._borrowedByUserId = null;
    }
}