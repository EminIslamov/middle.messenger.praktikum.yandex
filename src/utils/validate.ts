export const validateFirstName = (first_name: string): string | null => {
  const regex = /^[А-ЯA-Z][а-яa-zА-ЯA-Z-]*$/;
  return regex.test(first_name)
    ? null
    : "Имя должно начинаться с заглавной буквы и может содержать только буквы и дефис.";
};

export const validateSecondName = (second_name: string): string | null => {
  const regex = /^[А-ЯA-Z][а-яa-zА-ЯA-Z-]*$/;
  return regex.test(second_name)
    ? null
    : "Фамилия должна начинаться с заглавной буквы и может содержать только буквы и дефис.";
};

export const validateLogin = (login: string): string | null => {
  const regex = /^(?!\d+$)[A-Za-z0-9_-]{3,20}$/;
  return regex.test(login)
    ? null
    : "Логин может содержать от 3 до 20 символов латиницы, цифры, дефис и подчёркивание, но не состоять только из цифр.";
};

export const validateEmail = (email: string): string | null => {
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return regex.test(email) ? null : "Неверный формат электронной почты.";
};

export const validatePassword = (password: string): string | null => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?])?[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?]{8,40}$/;
  return regex.test(password)
    ? null
    : "Пароль должен содержать от 8 до 40 символов, хотя бы одну заглавную букву и одну цифру.";
};

export const validatePhone = (phone: string): string | null => {
  const regex = /^\+?\d{10,15}$/;
  return regex.test(phone)
    ? null
    : "Телефон должен содержать от 10 до 15 цифр и может начинаться с плюса.";
};

export const validateMessage = (message: string): string | null => {
  return message.trim().length > 0 ? null : "Сообщение не может быть пустым.";
};
