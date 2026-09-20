import { expect } from "chai";

import { Validation } from "../src/utils/validators";

describe("Validation", () => {
  describe("isRequired", () => {
    it("повертає true для заповненого поля", () => {
      expect(Validation.isRequired("Книга")).to.equal(true);
    });

    it("повертає false для порожнього поля", () => {
      expect(Validation.isRequired("")).to.equal(false);
    });

    it("повертає false для рядка з пробілами", () => {
      expect(Validation.isRequired("   ")).to.equal(false);
    });
  });

  describe("isValidUserId", () => {
    it("приймає ID, який складається тільки із цифр", () => {
      expect(Validation.isValidUserId("12345")).to.equal(true);
    });

    it("відхиляє ID, який містить літери", () => {
      expect(Validation.isValidUserId("12A45")).to.equal(false);
    });

    it("відхиляє порожній ID", () => {
      expect(Validation.isValidUserId("")).to.equal(false);
    });
  });

  describe("isValidPublicationYear", () => {
    it("приймає коректний чотиризначний рік", () => {
      expect(Validation.isValidPublicationYear("2020")).to.equal(true);
    });

    it("відхиляє значення з літерами", () => {
      expect(Validation.isValidPublicationYear("20AB")).to.equal(false);
    });

    it("відхиляє коротке числове значення", () => {
      expect(Validation.isValidPublicationYear("999")).to.equal(false);
    });

    it("відхиляє рік із майбутнього", () => {
      const futureYear = String(new Date().getFullYear() + 1);

      expect(Validation.isValidPublicationYear(futureYear)).to.equal(false);
    });
  });
});
