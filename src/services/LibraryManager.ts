import { Book } from "../models/Book";
import { User } from "../models/User";
import type { BookData, UserData } from "../types";
import { generateId } from "../utils/idGenerator";
import { Library } from "./Library";
import { Storage } from "./Storage";

export class LibraryManager {
    private readonly books = new Library<Book>();
    private readonly users = new Library<User>();

    constructor(private readonly storage = new Storage()) {
        this.restoreData();
    }

    getAllBooks(): Book[] {
        return this.books.getAll();
    }

    getAllUsers(): User[] {
        return this.users.getAll();
    }

    addBook(title: string, author: string, publicationYear: number): Book {
        const book = new Book(
            generateId(),
            title.trim(),
            author.trim(),
            publicationYear
        );

        this.books.add(book);
        this.saveData();

        return book;
    }

    addUser(id: string, name: string, email: string): User {
        const user = new User(id.trim(), name.trim(), email.trim());

        this.users.add(user);
        this.saveData();

        return user;
    }

    removeBook(bookId: string): boolean {
        const book = this.books.findById(bookId);

        if (!book) {
            return false;
        }

        if (book.isBorrowed) {
            throw new Error("Не можна видалити книгу, яку зараз позичено");
        }

        const wasRemoved = this.books.remove(bookId);

        if (wasRemoved) {
            this.saveData();
        }

        return wasRemoved;
    }

    removeUser(userId: string): boolean {
        const user = this.users.findById(userId);

        if (!user) {
            return false;
        }

        if (user.borrowedBookIds.length > 0) {
            throw new Error(
                "Не можна видалити користувача, який не повернув усі книги"
            );
        }

        const wasRemoved = this.users.remove(userId);

        if (wasRemoved) {
            this.saveData();
        }

        return wasRemoved;
    }

    searchBooks(query: string): Book[] {
        const normalizedQuery = query.trim().toLowerCase();

        if (normalizedQuery.length === 0) {
            return this.books.getAll();
        }

        return this.books.search((book) => {
            const title = book.title.toLowerCase();
            const author = book.author.toLowerCase();

            return (
                title.includes(normalizedQuery) ||
                author.includes(normalizedQuery)
            );
        });
    }

    borrowBook(bookId: string, userId: string): void {
        const book = this.books.findById(bookId);
        const user = this.users.findById(userId);

        if (!book) {
            throw new Error("Книгу не знайдено");
        }

        if (!user) {
            throw new Error("Користувача з таким ID не знайдено");
        }

        if (book.isBorrowed) {
            throw new Error("Цю книгу вже позичено");
        }

        if (user.borrowedBookIds.length >= 3) {
            throw new Error(
                "Користувач не може позичити більше трьох книг"
            );
        }

        book.borrow(user.id);
        user.addBorrowedBook(book.id);

        this.saveData();
    }

    returnBook(bookId: string): void {
        const book = this.books.findById(bookId);

        if (!book) {
            throw new Error("Книгу не знайдено");
        }

        if (!book.isBorrowed || book.borrowedByUserId === null) {
            throw new Error("Ця книга не була позичена");
        }

        const user = this.users.findById(book.borrowedByUserId);

        book.returnBook();

        if (user && user.borrowedBookIds.includes(bookId)) {
            user.removeBorrowedBook(bookId);
        }

        this.saveData();
    }

    private saveData(): void {
        const bookData: BookData[] = this.books.getAll().map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            publicationYear: book.publicationYear,
            isBorrowed: book.isBorrowed,
            borrowedByUserId: book.borrowedByUserId
        }));

        const userData: UserData[] = this.users.getAll().map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            borrowedBookIds: [...user.borrowedBookIds]
        }));

        this.storage.save("books", bookData);
        this.storage.save("users", userData);
    }

    private restoreData(): void {
        const bookData = this.storage.load<BookData[]>("books") ?? [];
        const userData = this.storage.load<UserData[]>("users") ?? [];

        const restoredBooks = bookData.map(
            (book) =>
                new Book(
                    book.id,
                    book.title,
                    book.author,
                    book.publicationYear,
                    book.isBorrowed,
                    book.borrowedByUserId
                )
        );

        const restoredUsers = userData.map(
            (user) =>
                new User(
                    user.id,
                    user.name,
                    user.email,
                    user.borrowedBookIds
                )
        );

        this.books.replaceAll(restoredBooks);
        this.users.replaceAll(restoredUsers);
    }
}