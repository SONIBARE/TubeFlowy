import { EventsHandler } from "./eventHandler";

type TubeflowyEvents = {
  "item-play": Item;
  "item-renamed": Item;
  "item-collapse": Item;
  "item-focused": Item;
  "items-loaded": void;
};

const events = new EventsHandler<TubeflowyEvents>();

export default events;
