// import * as database from "./api/loginService";
// import * as stateLoader from "./api/stateLoader";
import { dom } from "./infra";
// import { renderApp } from "./page";
import { renderTreeView } from "./treeView2";

// const loadRemoteData = () => {
//   database.initFirebase(() => undefined);

//   stateLoader.loadRemoteState();
// };

// document.body.appendChild(renderApp());
// loadRemoteData();

dom.append(document.body, renderTreeView());
