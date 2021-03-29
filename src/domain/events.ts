import { EventsHandler } from "./eventHandler";

type TubeflowyEvents = {
  "item-title-changed": Item;
};

const events = new EventsHandler<TubeflowyEvents>();

export default events;
