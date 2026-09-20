import { LibraryManager } from "../services/LibraryManager";
import { NotificationService } from "../services/NotificationService";
import { BookForm } from "./components/BookForm";
import { BookList } from "./components/BookList";
import { Modal } from "./components/Modal";
import { UserForm } from "./components/UserForm";
import { UserList } from "./components/UserList";

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return "Сталася невідома помилка";
}

export function renderApp(
    rootElement: HTMLElement,
    libraryManager: LibraryManager
): void {
    rootElement.replaceChildren();

    const main = document.createElement("main");
    main.className = "container app-shell py-5";

    const header = document.createElement("header");
    header.className = "text-center mb-5";

    const title = document.createElement("h1");
    title.className = "display-6 fw-bold mb-2";
    title.textContent = "Система управління бібліотекою";

    const subtitle = document.createElement("p");
    subtitle.className = "text-secondary mb-0";
    subtitle.textContent =
        "Облік книг, користувачів, позичань і повернень";

    header.append(title, subtitle);

    const refreshApplication = (): void => {
        renderApp(rootElement, libraryManager);
    };

    const bookForm = new BookForm((formData) => {
        try {
            libraryManager.addBook(
                formData.title,
                formData.author,
                formData.publicationYear
            );

            NotificationService.success(
                `Книгу «${formData.title}» успішно додано`
            );

            refreshApplication();
            return true;
        } catch (error: unknown) {
            NotificationService.error(getErrorMessage(error));
            return false;
        }
    });

    const userForm = new UserForm((formData) => {
        try {
            libraryManager.addUser(
                formData.id,
                formData.name,
                formData.email
            );

            NotificationService.success(
                `Користувача ${formData.name} успішно додано`
            );

            refreshApplication();
            return true;
        } catch (error: unknown) {
            NotificationService.error(getErrorMessage(error));
            return false;
        }
    });

    const bookList = new BookList({
        onBorrow: async (bookId: string): Promise<void> => {
            const userId = await Modal.promptUserId();

            if (userId === null) {
                return;
            }

            try {
                libraryManager.borrowBook(bookId, userId);

                const book = libraryManager
                    .getAllBooks()
                    .find((currentBook) => currentBook.id === bookId);

                NotificationService.success(
                    book
                        ? `Книгу «${book.title}» успішно позичено`
                        : "Книгу успішно позичено"
                );

                refreshApplication();
            } catch (error: unknown) {
                NotificationService.error(getErrorMessage(error));
            }
        },

        onReturn: (bookId: string): void => {
            try {
                const book = libraryManager
                    .getAllBooks()
                    .find((currentBook) => currentBook.id === bookId);

                libraryManager.returnBook(bookId);

                NotificationService.success(
                    book
                        ? `Книгу «${book.title}» успішно повернено`
                        : "Книгу успішно повернено"
                );

                refreshApplication();
            } catch (error: unknown) {
                NotificationService.error(getErrorMessage(error));
            }
        },

        onDelete: (bookId: string): void => {
            try {
                const wasRemoved = libraryManager.removeBook(bookId);

                if (!wasRemoved) {
                    NotificationService.error("Книгу не знайдено");
                    return;
                }

                NotificationService.success("Книгу успішно видалено");
                refreshApplication();
            } catch (error: unknown) {
                NotificationService.error(getErrorMessage(error));
            }
        }
    });

    const userList = new UserList({
        onDelete: (userId: string): void => {
            try {
                const wasRemoved = libraryManager.removeUser(userId);

                if (!wasRemoved) {
                    NotificationService.error("Користувача не знайдено");
                    return;
                }

                NotificationService.success(
                    "Користувача успішно видалено"
                );

                refreshApplication();
            } catch (error: unknown) {
                NotificationService.error(getErrorMessage(error));
            }
        }
    });

    main.append(
        header,
        bookForm.render(),
        userForm.render(),
        bookList.render(libraryManager.getAllBooks()),
        userList.render(libraryManager.getAllUsers())
    );

    rootElement.append(main);
}