import { init } from "./src/domain";
import { EventsHandler } from "./src/infra";
import { viewAppShell } from "./src/page";

const events = new EventsHandler<MyEvents>();
init(events);
document.body.appendChild(viewAppShell());
