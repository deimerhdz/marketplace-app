import { environment } from '@env/environment';

const url = environment.apiUrl;
export const URL_AUTH_CONFIRM_PASS = `${url}/auth/confirm-password`;
export const URL_AUTH_SIGNUP = `${url}/auth/register`;
export const URL_AUTH_SIGNIN = `${url}/auth/login`;
export const URL_AUTH_REFRESH = `${url}/auth/refresh`;
export const URL_BREEDS = `${url}/breeds`;
export const URL_CATALOG = `${url}/catalog`;
