import { Modal as BootstrapModal } from "bootstrap";

export class Modal {
    static showMessage(
        title: string,
        message: string,
        buttonText = "Закрити"
    ): void {
        const modalElement = document.createElement("div");

        modalElement.className = "modal fade";
        modalElement.tabIndex = -1;
        modalElement.setAttribute("aria-hidden", "true");

        modalElement.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title fs-5"></h2>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Закрити"
            ></button>
          </div>

          <div class="modal-body">
            <p class="modal-message mb-0"></p>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            ></button>
          </div>
        </div>
      </div>
    `;

        const titleElement =
            modalElement.querySelector<HTMLElement>(".modal-title");
        const messageElement =
            modalElement.querySelector<HTMLElement>(".modal-message");
        const actionButton =
            modalElement.querySelector<HTMLButtonElement>(".btn-primary");

        if (!titleElement || !messageElement || !actionButton) {
            throw new Error("Не вдалося створити модальне вікно");
        }

        titleElement.textContent = title;
        messageElement.textContent = message;
        actionButton.textContent = buttonText;

        document.body.append(modalElement);

        const modal = new BootstrapModal(modalElement);

        modalElement.addEventListener(
            "hidden.bs.modal",
            () => {
                modal.dispose();
                modalElement.remove();
            },
            { once: true }
        );

        modal.show();
    }

    static promptUserId(): Promise<string | null> {
        return new Promise((resolve) => {
            const modalElement = document.createElement("div");

            modalElement.className = "modal fade";
            modalElement.tabIndex = -1;
            modalElement.setAttribute("aria-hidden", "true");

            modalElement.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title fs-5">
                Введіть ID користувача
              </h2>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Закрити"
              ></button>
            </div>

            <div class="modal-body">
              <label for="borrow-user-id" class="form-label">
                ID користувача для позичання книги
              </label>

              <input
                id="borrow-user-id"
                type="text"
                inputmode="numeric"
                class="form-control"
                placeholder="Наприклад: 12345"
              />

              <div class="invalid-feedback">
                Введіть ID користувача
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Скасувати
              </button>

              <button
                type="button"
                class="btn btn-primary save-user-id"
              >
                Позичити
              </button>
            </div>
          </div>
        </div>
      `;

            const input =
                modalElement.querySelector<HTMLInputElement>(
                    "#borrow-user-id"
                );

            const saveButton =
                modalElement.querySelector<HTMLButtonElement>(
                    ".save-user-id"
                );

            if (!input || !saveButton) {
                throw new Error("Не вдалося створити поле ID користувача");
            }

            document.body.append(modalElement);

            const modal = new BootstrapModal(modalElement);
            let result: string | null = null;

            saveButton.addEventListener("click", () => {
                const userId = input.value.trim();

                if (userId.length === 0) {
                    input.classList.add("is-invalid");
                    return;
                }

                result = userId;
                modal.hide();
            });

            input.addEventListener("input", () => {
                input.classList.remove("is-invalid");
            });

            modalElement.addEventListener(
                "shown.bs.modal",
                () => {
                    input.focus();
                },
                { once: true }
            );

            modalElement.addEventListener(
                "hidden.bs.modal",
                () => {
                    resolve(result);
                    modal.dispose();
                    modalElement.remove();
                },
                { once: true }
            );

            modal.show();
        });
    }
}