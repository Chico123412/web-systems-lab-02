import { Modal } from "../ui/components/Modal";

export class NotificationService {
  static success(message: string): void {
    Modal.showMessage("Успішно", message, "Зрозуміло");
  }

  static error(message: string): void {
    Modal.showMessage("Помилка", message, "Закрити");
  }

  static info(message: string): void {
    Modal.showMessage("Інформація", message, "Добре");
  }
}
