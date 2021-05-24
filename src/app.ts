import { init, items } from "./domain";
import { EventsHandler } from "./infra";
import { viewAppShell } from "./page";
import { loadLocalItems } from "./stateLoader";

const events = new EventsHandler<MyEvents>();
init(events);
items.itemsLoaded(loadLocalItems());
document.body.appendChild(viewAppShell());
