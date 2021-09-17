export const useStorage = (key: string, value?: any): unknown => {
  if (value) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    const data = !!localStorage.getItem(key);
    if (data) {
      return JSON.parse(localStorage.getItem(key) as string);
    } else {
      return null;
    }
  }
};
