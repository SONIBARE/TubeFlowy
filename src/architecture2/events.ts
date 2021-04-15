export type MyEvents = {
  "items-loaded": Items;

  "item-collapse": Item;
  "item-focused": Item;
  "item-play": Item;
  "item-click": { item: Item; rowElement: HTMLElement };
};
