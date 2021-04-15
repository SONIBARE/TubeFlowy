export { MyEvents } from "./events";
import { ItemsStore } from "./ItemsStore";
import PlayerStore from "./PlayerStore";

export let items: ItemsStore;

export const setItems = (i: ItemsStore) => (items = i);

export let player: PlayerStore;

export const setPlayer = (i: PlayerStore) => (player = i);
