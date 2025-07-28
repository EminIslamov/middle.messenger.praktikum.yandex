import { expect } from "chai";
import { validateEmail, validatePassword } from "./validate.js";

describe("Validation Functions", () => {
  describe("validateEmail", () => {
    it("should return null for valid email", () => {
      const result = validateEmail("test@example.com");
      expect(result).to.equal(null);
    });

    it("should return error message for invalid email", () => {
      const result = validateEmail("invalid-email");
      expect(result).to.be.a("string");
      expect(result).to.include("Неверный формат");
    });
  });

  describe("validatePassword", () => {
    it("should return null for valid password", () => {
      const result = validatePassword("ValidPass123");
      expect(result).to.equal(null);
    });

    it("should return error message for short password", () => {
      const result = validatePassword("short");
      expect(result).to.be.a("string");
      expect(result).to.include("от 8 до 40 символов");
    });
  });
});
