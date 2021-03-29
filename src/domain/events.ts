import { EventsHandler } from "./eventHandler";

type TubeflowyEvents = {
  "item-play": Item;
  "item-renamed": Item;
  "item-collapse": Item;
  "item-focused": Item;
  "items-loaded": Items;

  //probably remove this event and use item-collapse instead if possible
  //currently I rely on page height, which is changing during animation and I fire
  //item-collapse event before animation. Solution - minimap not to know about page height and calculate it dynamically during render
  "redraw-canvas": undefined;
};

export const events = new EventsHandler<TubeflowyEvents>();
