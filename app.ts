import { init, items } from "./src/domain";
import { EventsHandler } from "./src/infra";
import { viewAppShell } from "./src/page";
import { loadLocalItems } from "./src/stateLoader";

const events = new EventsHandler<MyEvents>();
init(events);
items.itemsLoaded(loadLocalItems());
document.body.appendChild(viewAppShell());
