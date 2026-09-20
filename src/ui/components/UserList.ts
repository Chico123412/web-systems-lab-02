import type { User } from "../../models/User";

interface UserListHandlers {
    onDelete: (userId: string) => void;
}

export class UserList {
    private readonly itemsPerPage = 5;

    constructor(private readonly handlers: UserListHandlers) {}

    render(users: User[]): HTMLElement {
        const section = document.createElement("section");
        section.className = "card border-0 shadow-sm mb-4";

        section.innerHTML = `
      <div class="card-body p-4">
        <h2 class="h4 mb-3">Список користувачів</h2>

        <div class="user-list"></div>

        <nav
          class="user-pagination mt-3"
          aria-label="Сторінки користувачів"
        ></nav>
      </div>
    `;

        const listContainer =
            section.querySelector<HTMLElement>(".user-list");
        const paginationContainer =
            section.querySelector<HTMLElement>(".user-pagination");

        if (!listContainer || !paginationContainer) {
            throw new Error("Не вдалося створити список користувачів");
        }

        let currentPage = 1;

        const renderPagination = (totalItems: number): void => {
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
                    renderUsers();
                });

                paginationItem.append(pageButton);
                paginationList.append(paginationItem);
            }

            paginationContainer.append(paginationList);
        };

        const renderUsers = (): void => {
            const totalPages = Math.max(
                1,
                Math.ceil(users.length / this.itemsPerPage)
            );

            if (currentPage > totalPages) {
                currentPage = totalPages;
            }

            const startIndex = (currentPage - 1) * this.itemsPerPage;
            const usersForCurrentPage = users.slice(
                startIndex,
                startIndex + this.itemsPerPage
            );

            listContainer.replaceChildren();

            if (usersForCurrentPage.length === 0) {
                const emptyMessage = document.createElement("p");
                emptyMessage.className =
                    "text-secondary text-center py-4 mb-0";
                emptyMessage.textContent = "Користувачів ще немає";

                listContainer.append(emptyMessage);
                renderPagination(0);
                return;
            }

            const listGroup = document.createElement("div");
            listGroup.className = "list-group list-group-flush";

            usersForCurrentPage.forEach((user) => {
                const item = document.createElement("div");
                item.className =
                    "list-group-item px-0 py-3 d-flex flex-column " +
                    "flex-lg-row justify-content-between align-items-lg-center gap-3";

                const information = document.createElement("div");

                const name = document.createElement("h3");
                name.className = "h6 mb-1";
                name.textContent = user.name;

                const details = document.createElement("p");
                details.className = "text-secondary small mb-1";
                details.textContent = `ID: ${user.id} · ${user.email}`;

                const borrowedBooks = document.createElement("p");
                borrowedBooks.className = "small mb-0";

                if (user.borrowedBookIds.length === 0) {
                    borrowedBooks.classList.add("text-success");
                    borrowedBooks.textContent = "Позичених книг немає";
                } else {
                    borrowedBooks.classList.add("text-warning-emphasis");
                    borrowedBooks.textContent =
                        `Позичено книг: ${user.borrowedBookIds.length} із 3`;
                }

                information.append(name, details, borrowedBooks);

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "btn btn-outline-danger btn-sm";
                deleteButton.textContent = "Видалити користувача";

                deleteButton.addEventListener("click", () => {
                    this.handlers.onDelete(user.id);
                });

                item.append(information, deleteButton);
                listGroup.append(item);
            });

            listContainer.append(listGroup);
            renderPagination(users.length);
        };

        renderUsers();

        return section;
    }
}