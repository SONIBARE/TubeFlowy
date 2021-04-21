import { EventsHandler } from "../infra";
import ItemsStore from "./ItemsStore";
import PlayerStore from "./PlayerStore";
import Search from "./Search";

export let items: ItemsStore;
export let player: PlayerStore;
export let search: Search;

export const init = (events: EventsHandler<MyEvents>) => {
  items = new ItemsStore(events);
  player = new PlayerStore(events);
  search = new Search(events);
};
