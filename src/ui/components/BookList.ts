import type { Book } from "../../models/Book";

interface BookListHandlers {
    onBorrow: (bookId: string) => Promise<void>;
    onReturn: (bookId: string) => void;
    onDelete: (bookId: string) => void;
}

export class BookList {
    private readonly itemsPerPage = 5;

    constructor(private readonly handlers: BookListHandlers) {}

    render(books: Book[]): HTMLElement {
        const section = document.createElement("section");
        section.className = "card border-0 shadow-sm mb-4";

        section.innerHTML = `
      <div class="card-body p-4">
        <div
          class="d-flex flex-column flex-md-row
                 justify-content-between align-items-md-center gap-3 mb-3"
        >
          <h2 class="h4 mb-0">Список книг</h2>

          <div class="book-search-wrapper">
            <label for="book-search" class="visually-hidden">
              Пошук книг
            </label>

            <input
              id="book-search"
              type="search"
              class="form-control"
              placeholder="Пошук за назвою або автором"
            />
          </div>
        </div>

        <div class="book-list"></div>
        <nav class="book-pagination mt-3" aria-label="Сторінки книг"></nav>
      </div>
    `;

        const searchInput =
            section.querySelector<HTMLInputElement>("#book-search");
        const listContainer =
            section.querySelector<HTMLElement>(".book-list");
        const paginationContainer =
            section.querySelector<HTMLElement>(".book-pagination");

        if (!searchInput || !listContainer || !paginationContainer) {
            throw new Error("Не вдалося створити список книг");
        }

        let currentPage = 1;

        const getFilteredBooks = (): Book[] => {
            const query = searchInput.value.trim().toLowerCase();

            if (query.length === 0) {
                return books;
            }

            return books.filter((book) => {
                return (
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query)
                );
            });
        };

        const renderPagination = (
            totalItems: number,
            renderPage: () => void
        ): void => {
            paginationContainer.replaceChildren();

            const totalPages = Math.ceil(
                totalItems / this.itemsPerPage
            );

            if (totalPages <= 1) {
                return;
            }

            const paginationList = document.createElement("ul");
            paginationList.className =
                "pagination pagination-sm justify-content-center mb-0";

            for (let page = 1; page <= totalPages; page += 1) {
                const paginationItem = document.createElement("li");
                paginationItem.className = "page-item";

                if (page === currentPage) {
                    paginationItem.classList.add("active");
                }

                const pageButton = document.createElement("button");
                pageButton.type = "button";
                pageButton.className = "page-link";
                pageButton.textContent = String(page);
                pageButton.setAttribute(
                    "aria-label",
                    `Перейти на сторінку ${page}`
                );

                pageButton.addEventListener("click", () => {
                    currentPage = page;
                    renderPage();
                });

                paginationItem.append(pageButton);
                paginationList.append(paginationItem);
            }

            paginationContainer.append(paginationList);
        };

        const renderBooks = (): void => {
            const filteredBooks = getFilteredBooks();
            const totalPages = Math.max(
                1,
                Math.ceil(filteredBooks.length / this.itemsPerPage)
            );

            if (currentPage > totalPages) {
                currentPage = totalPages;
            }

            const startIndex = (currentPage - 1) * this.itemsPerPage;
            const booksForCurrentPage = filteredBooks.slice(
                startIndex,
                startIndex + this.itemsPerPage
            );

            listContainer.replaceChildren();

            if (booksForCurrentPage.length === 0) {
                const emptyMessage = document.createElement("p");
                emptyMessage.className =
                    "text-secondary text-center py-4 mb-0";
                emptyMessage.textContent = "Книг не знайдено";

                listContainer.append(emptyMessage);
                renderPagination(0, renderBooks);
                return;
            }

            const listGroup = document.createElement("div");
            listGroup.className = "list-group list-group-flush";

            booksForCurrentPage.forEach((book) => {
                const item = document.createElement("div");
                item.className =
                    "list-group-item px-0 py-3 d-flex flex-column " +
                    "flex-lg-row justify-content-between align-items-lg-center gap-3";

                const information = document.createElement("div");

                const title = document.createElement("h3");
                title.className = "h6 mb-1";
                title.textContent = book.title;

                const details = document.createElement("p");
                details.className = "text-secondary small mb-1";
                details.textContent =
                    `${book.author}, ${book.publicationYear}`;

                const status = document.createElement("span");
                status.className = book.isBorrowed
                    ? "badge text-bg-warning"
                    : "badge text-bg-success";

                status.textContent = book.isBorrowed
                    ? `Позичено користувачем: ${book.borrowedByUserId ?? "невідомо"}`
                    : "Доступна";

                information.append(title, details, status);

                const actions = document.createElement("div");
                actions.className = "d-flex flex-wrap gap-2";

                if (book.isBorrowed) {
                    const returnButton = document.createElement("button");
                    returnButton.type = "button";
                    returnButton.className = "btn btn-warning btn-sm";
                    returnButton.textContent = "Повернути";

                    returnButton.addEventListener("click", () => {
                        this.handlers.onReturn(book.id);
                    });

                    actions.append(returnButton);
                } else {
                    const borrowButton = document.createElement("button");
                    borrowButton.type = "button";
                    borrowButton.className = "btn btn-primary btn-sm";
                    borrowButton.textContent = "Позичити";

                    borrowButton.addEventListener("click", () => {
                        void this.handlers.onBorrow(book.id);
                    });

                    actions.append(borrowButton);
                }

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "btn btn-outline-danger btn-sm";
                deleteButton.textContent = "Видалити";

                deleteButton.addEventListener("click", () => {
                    this.handlers.onDelete(book.id);
                });

                actions.append(deleteButton);
                item.append(information, actions);
                listGroup.append(item);
            });

            listContainer.append(listGroup);
            renderPagination(filteredBooks.length, renderBooks);
        };

        searchInput.addEventListener("input", () => {
            currentPage = 1;
            renderBooks();
        });

        renderBooks();

        return section;
    }
}