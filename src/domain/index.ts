import { EventsHandler } from "../infra";
import ItemsStore from "./ItemsStore";
import KeyboardInput from "./KeyboardInput";
import PlayerStore from "./PlayerStore";
import UiState from "./Search";

export let items: ItemsStore;
export let player: PlayerStore;
export let ui: UiState;
export let keyboardInput: KeyboardInput;

export const init = (events: EventsHandler<MyEvents>) => {
  items = new ItemsStore(events);
  player = new PlayerStore(events);
  ui = new UiState();
  keyboardInput = new KeyboardInput(events);
};
export const cleanup = () => {
  keyboardInput.cleanup();
};
