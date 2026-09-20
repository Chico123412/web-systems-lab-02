export namespace Validation {
    export function isRequired(value: string): boolean {
        return value.trim().length > 0;
    }

    export function isValidUserId(value: string): boolean {
        return /^\d+$/.test(value.trim());
    }

    export function isValidPublicationYear(value: string): boolean {
        const normalizedValue = value.trim();
        const yearPattern = /^(1\d{3}|20\d{2})$/;

        if (!yearPattern.test(normalizedValue)) {
            return false;
        }

        const year = Number(normalizedValue);
        const currentYear = new Date().getFullYear();

        return year <= currentYear;
    }

    export function isValidEmail(value: string): boolean {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value.trim());
    }
}