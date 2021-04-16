import { EventsHandler } from "../infra";
import ItemsStore from "./ItemsStore";
import PlayerStore from "./PlayerStore";

export let items: ItemsStore;
export let player: PlayerStore;

export const init = (events: EventsHandler<MyEvents>) => {
  items = new ItemsStore(events);
  player = new PlayerStore(events);
};
