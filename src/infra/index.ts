// import { folderPlus } from "./icons";

// export { collapsibleContainer as viewCollapsibleContainer } from "./CollapsibleContainer";
export { css, Styles } from "./style";
export { zIndexes, tIds, ids, cls, ClassName } from "./keys";
// export type { ClassName } from "./projectSpecific/keys";
export { div, fragment, img, span, input, button, canvas } from "./dom"; //   findFirstByClass,
export * as dom from "./dom";
export { svg, circle, path } from "./svg"; //   findFirstByClass,
export { EventsHandler } from "./eventsHandler";
//   findById,
//   fragment,
//   DivDefinition,
//   EventsDefinition,

// export * as dom from "./dom";
export * as icons from "./icons";
export { colors, spacings, timings } from "./constants";
export * as anim from "./animations";
export * as utils from "./utils";
export { debounce } from "./debounce";
export { compose } from "./functions";
// export { colors, spacings, typography } from "./projectSpecific/constants";
// export * as itemEvents from "./events";
import * as dom from "./dom";
//@ts-expect-error
global.dom = dom;

// import * as anim from "./animations";

// export const CollapsibleContainer = c;
