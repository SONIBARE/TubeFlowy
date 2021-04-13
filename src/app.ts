// import * as database from "./api/loginService";
// import * as stateLoader from "./api/stateLoader";
import { items } from "./domain";
import { dom } from "./infra";
// import { renderApp } from "./page";
import { renderTreeView } from "./treeView2";

// const loadRemoteData = () => {
//   database.initFirebase(() => undefined);

//   stateLoader.loadRemoteState();
// };

// document.body.appendChild(renderApp());
// loadRemoteData();
//STATE
const loadLocalItems = (): Items => {
  const localData = localStorage.getItem("tubeflowyData:v1")!;
  const parsed = JSON.parse(localData) as any;
  const loadedItems: Items = JSON.parse(parsed.itemsSerialized);
  return loadedItems;
};

items.itemsLoaded(loadLocalItems());
dom.append(document.body, renderTreeView());
