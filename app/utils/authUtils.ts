// authUtils.ts

export const validateEmail = (email: string): boolean => {
    // Regex for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password: string): boolean => {
    // Example regex: password must be at least 6 characters long and include at least one letter and one number
    // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    const passwordRegex = /^[a-zA-Z\d]{6,}$/;
  
    return passwordRegex.test(password);
  };
  
  export const authenticateUser = (email: string, password: string): boolean => {
    // Simple static authentication (replace with your actual authentication logic)
    return email === 'rbs@example.com' && password === 'password24';
  };
  // Phone Number Validation
  export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/; // Adjust regex as needed for international formats
    return phoneRegex.test(phone);
  };
  