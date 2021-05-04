import Store from "./store";

export const store = new Store();

//@ts-expect-error
global.store = store;
