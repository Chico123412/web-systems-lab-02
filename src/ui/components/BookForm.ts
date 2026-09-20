import { Validation } from "../../utils/validators";

export interface BookFormData {
    title: string;
    author: string;
    publicationYear: number;
}

type BookFormSubmitHandler = (data: BookFormData) => boolean;

export class BookForm {
    constructor(
        private readonly onSubmit: BookFormSubmitHandler
    ) {}

    render(): HTMLElement {
        const section = document.createElement("section");
        section.className = "card border-0 shadow-sm mb-4";

        section.innerHTML = `
      <div class="card-body p-4">
        <h2 class="h4 mb-3">Додати книгу</h2>

        <form class="book-form" novalidate>
          <div class="row g-3">
            <div class="col-md-5">
              <label for="book-title" class="form-label">
                Назва книги
              </label>

              <input
                id="book-title"
                name="title"
                type="text"
                class="form-control"
                placeholder="Введіть назву"
              />

              <div class="invalid-feedback">
                Вкажіть назву книги
              </div>
            </div>

            <div class="col-md-4">
              <label for="book-author" class="form-label">
                Автор
              </label>

              <input
                id="book-author"
                name="author"
                type="text"
                class="form-control"
                placeholder="Введіть автора"
              />

              <div class="invalid-feedback">
                Вкажіть автора
              </div>
            </div>

            <div class="col-md-3">
              <label for="book-year" class="form-label">
                Рік видання
              </label>

              <input
                id="book-year"
                name="publicationYear"
                type="text"
                inputmode="numeric"
                maxlength="4"
                class="form-control"
                placeholder="Наприклад: 2020"
              />

              <div class="invalid-feedback">
                Введіть коректний рік видання
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-success mt-3">
            Додати книгу
          </button>
        </form>
      </div>
    `;

        const form =
            section.querySelector<HTMLFormElement>(".book-form");
        const titleInput =
            section.querySelector<HTMLInputElement>("#book-title");
        const authorInput =
            section.querySelector<HTMLInputElement>("#book-author");
        const yearInput =
            section.querySelector<HTMLInputElement>("#book-year");

        if (!form || !titleInput || !authorInput || !yearInput) {
            throw new Error("Не вдалося створити форму книги");
        }

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const isTitleValid = Validation.isRequired(titleInput.value);
            const isAuthorValid = Validation.isRequired(authorInput.value);
            const isYearValid = Validation.isValidPublicationYear(
                yearInput.value
            );

            titleInput.classList.toggle("is-invalid", !isTitleValid);
            authorInput.classList.toggle("is-invalid", !isAuthorValid);
            yearInput.classList.toggle("is-invalid", !isYearValid);

            if (!isTitleValid || !isAuthorValid || !isYearValid) {
                return;
            }

            const wasAdded = this.onSubmit({
                title: titleInput.value.trim(),
                author: authorInput.value.trim(),
                publicationYear: Number(yearInput.value)
            });

            if (wasAdded) {
                form.reset();
            }
        });

        [titleInput, authorInput, yearInput].forEach((input) => {
            input.addEventListener("input", () => {
                input.classList.remove("is-invalid");
            });
        });

        return section;
    }
}