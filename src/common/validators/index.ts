import {
  REGEX_VALID_EMAIL, REGEX_VALID_NAME,
  REGEX_VALID_NUMBERS,
  REGEX_VALID_PHONE_NUMBER, REGEX_VALID_USERNAME
} from '@/common/constants/regex-validators.ts'

const msgVerifyCharacter = 'Caracteres invalidos'
const msgVerifyNumber = 'Este campo acepta solo números positivos'

export const required = (v: string): string | boolean => !!v || 'Este campo es requerido'
export const emailValidator = (v: string): string | boolean => {
  if (!v) return true;
  return REGEX_VALID_EMAIL.test(v) || "Correo electrónico no válido";
};
export const phoneNumberValidator = (v: string): string | boolean =>
  REGEX_VALID_PHONE_NUMBER.test(v) || 'Número de teléfono inválido'
export const namesValidator = (v: string) => REGEX_VALID_NAME.test(v) || msgVerifyCharacter
export const userNamesValidator = (v: string) => REGEX_VALID_USERNAME.test(v) || msgVerifyCharacter
export const numbersValidator = (v: string): string | boolean =>
  REGEX_VALID_NUMBERS.test(v) || msgVerifyNumber
