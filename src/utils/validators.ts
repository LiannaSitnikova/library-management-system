export namespace Validation {
  export function isRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  export function isValidNumericId(id: string): boolean {
    return /^\d+$/.test(id);
  }

  export function isValidYear(yearStr: string): boolean {
    return /^(1\d{3}|20\d{2})$/.test(yearStr);
  }
}