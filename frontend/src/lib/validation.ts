/**
 * Validates a password against security requirements
 * @param password The password to validate
 * @returns An object containing validation result and error message
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    }
  }

  if (!/[A-Za-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one letter'
    }
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    }
  }

  return {
    isValid: true,
    message: ''
  }
} 