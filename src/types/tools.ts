export type Flatten<T extends object> = {
  [K in keyof T]: T[K];
};
