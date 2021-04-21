import { EventsHandler } from "../infra";

export default class Search {
  constructor(public events: EventsHandler<MyEvents>) {}
  show = () => {};

  hide = () => {};

  bindToVisilibty = (cb: Func<boolean>) => {};
}
