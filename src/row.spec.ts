import "@testing-library/jest-dom";
import { fireEvent, getByTestId, queryByTestId } from "@testing-library/dom";
import { myRow } from "./row";
import { store } from "./state";

jest.mock("./infra/animations", () => ({
  expandHeight: () => ({
    addEventListener: (event: string, cb: EmptyFunc) => cb(),
  }),
  collapseHeight: () => ({
    addEventListener: (event: string, cb: EmptyFunc) => cb(),
  }),
  revertCurrentAnimations: () => false,
}));

const folder = (id: string, children?: string[]): Folder => ({
  id: id,
  title: id,
  type: "folder",
  children: children || [],
});
describe("Having an app", () => {
  beforeEach(() => {
    document.body.innerHTML = ``;
  });

  it("opening music node should show it's children", () => {
    const rock = folder("rock");
    const music: Item = folder("music", [rock.id]);
    const home = folder("HOME", [music.id]);
    store.setItems({
      [home.id]: home,
      [music.id]: music,
      [rock.id]: rock,
    });
    document.body.appendChild(myRow(music));
    expect(get("row-music")).toBeInTheDocument();
    expect(query("row-rock")).not.toBeInTheDocument();
    fireEvent.click(get("chevron-music"));
    expect(get("row-rock")).toBeInTheDocument();
    fireEvent.click(get("chevron-music"));
    expect(query("row-rock")).not.toBeInTheDocument();

    expect(store.events.events["itemChanged.rock"]).toBeUndefined();
  });

  it("with an open music folder shows rock content ", () => {
    const rock = folder("rock");
    const music = folder("music", [rock.id]);
    music.isCollapsedInGallery = true;
    const home = folder("HOME", [music.id]);
    store.setItems({
      [home.id]: home,
      [music.id]: music,
      [rock.id]: rock,
    });
    document.body.appendChild(myRow(music));
    expect(query("row-rock")).toBeInTheDocument();
  });
});

const get = (id: string) => getByTestId(document.body, id);
const query = (id: string) => queryByTestId(document.body, id);
