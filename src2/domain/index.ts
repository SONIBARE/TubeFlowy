import { init } from "./shortcuts";
import Store from "./store";

export const store = new Store();
init(store);
//@ts-expect-error
global.store = store;
