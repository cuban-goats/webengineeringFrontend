export function getCookie(name: string): string | undefined {
  return document.cookie.split("; ").find((c) => c.startsWith(name + "="))?.split("=")[1];
}

export function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/`;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
