export type Order = "order" | "random";

export type Pronunciation = "British" | "American";

export interface Word {
  en: string;
  zh: string;
  eg?: string;
}

export interface WordWithAudio extends Word {
  audioLink: string;
}

export interface User {
  email: string;
  password: string;
}

export interface UserSettings {
  orderMode: Order;
  pronunciationMode: Pronunciation;
  isChineseVisible: boolean;
  isEnglishVisible: boolean;
}
