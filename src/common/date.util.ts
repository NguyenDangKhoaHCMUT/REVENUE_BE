import { BadRequestException } from '@nestjs/common';

export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates that a given date string matches YYYY-MM-DD format.
 * Throws a BadRequestException if invalid.
 */
export function validateDateFormat(
  date: string,
  paramName = 'date',
): void {
  if (!DATE_REGEX.test(date)) {
    throw new BadRequestException(
      `${paramName} param must be formatted as YYYY-MM-DD`,
    );
  }
}

export function validateDate(date: string): void {
  validateDateFormat(date, 'date');
}
