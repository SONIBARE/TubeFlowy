import { firebaseConfig } from "./config";
declare const firebase: any;
let firebaseAuth: ReturnType<typeof firebase.auth>;

export const initFirebase = (onAuthChanged: any) => {
  firebase.initializeApp(firebaseConfig);
  firebaseAuth = firebase.auth();
  firebaseAuth.onAuthStateChanged(onAuthChanged);
};

export type PersistedState = {
  selectedItemId: string;
  focusedStack: string[];
  itemsSerialized: string;
  ui?: {
    leftSidebarWidth: number;
  };
};

export const loadUserSettings = (userId: string): Promise<PersistedState> =>
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((res: any) => res.data() as PersistedState);
