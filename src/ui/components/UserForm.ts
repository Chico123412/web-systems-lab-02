import { Validation } from "../../utils/validators";

export interface UserFormData {
  id: string;
  name: string;
  email: string;
}

type UserFormSubmitHandler = (data: UserFormData) => boolean;

export class UserForm {
  constructor(private readonly onSubmit: UserFormSubmitHandler) {}

  render(): HTMLElement {
    const section = document.createElement("section");
    section.className = "card border-0 shadow-sm mb-4";

    section.innerHTML = `
      <div class="card-body p-4">
        <h2 class="h4 mb-3">Додати користувача</h2>

        <form class="user-form" novalidate>
          <div class="row g-3">
            <div class="col-md-3">
              <label for="user-id" class="form-label">
                ID користувача
              </label>

              <input
                id="user-id"
                name="id"
                type="text"
                inputmode="numeric"
                class="form-control"
                placeholder="Тільки цифри"
              />

              <div class="invalid-feedback">
                ID має складатися тільки із цифр
              </div>
            </div>

            <div class="col-md-4">
              <label for="user-name" class="form-label">
                Ім’я
              </label>

              <input
                id="user-name"
                name="name"
                type="text"
                class="form-control"
                placeholder="Введіть ім’я"
              />

              <div class="invalid-feedback">
                Вкажіть ім’я користувача
              </div>
            </div>

            <div class="col-md-5">
              <label for="user-email" class="form-label">
                Email
              </label>

              <input
                id="user-email"
                name="email"
                type="email"
                class="form-control"
                placeholder="name@example.com"
              />

              <div class="invalid-feedback">
                Введіть коректну електронну адресу
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary mt-3">
            Додати користувача
          </button>
        </form>
      </div>
    `;

    const form = section.querySelector<HTMLFormElement>(".user-form");
    const idInput = section.querySelector<HTMLInputElement>("#user-id");
    const nameInput = section.querySelector<HTMLInputElement>("#user-name");
    const emailInput = section.querySelector<HTMLInputElement>("#user-email");

    if (!form || !idInput || !nameInput || !emailInput) {
      throw new Error("Не вдалося створити форму користувача");
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const isIdValid =
        Validation.isRequired(idInput.value) &&
        Validation.isValidUserId(idInput.value);

      const isNameValid = Validation.isRequired(nameInput.value);

      const isEmailValid =
        Validation.isRequired(emailInput.value) &&
        Validation.isValidEmail(emailInput.value);

      idInput.classList.toggle("is-invalid", !isIdValid);
      nameInput.classList.toggle("is-invalid", !isNameValid);
      emailInput.classList.toggle("is-invalid", !isEmailValid);

      if (!isIdValid || !isNameValid || !isEmailValid) {
        return;
      }

      const wasAdded = this.onSubmit({
        id: idInput.value.trim(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim()
      });

      if (wasAdded) {
        form.reset();
      }
    });

    [idInput, nameInput, emailInput].forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.remove("is-invalid");
      });
    });

    return section;
  }
}
