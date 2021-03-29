import "@testing-library/jest-dom";
import { fireEvent, getByTestId, queryByTestId } from "@testing-library/dom";
import { myRow } from "./row";
import { items, events } from "./domain";

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
  isCollapsedInGallery: true,
});
describe("Having an app", () => {
  beforeEach(() => {
    document.body.innerHTML = ``;
  });

  it("opening music node should show it's children", () => {
    const rock = folder("rock");
    const music: Item = folder("music", [rock.id]);
    const home = folder("HOME", [music.id]);
    items.itemsLoaded({
      [home.id]: home,
      [music.id]: music,
      [rock.id]: rock,
    });
    document.body.appendChild(myRow(music));
    expect(get("row-music")).toBeInTheDocument();
    expect(query("row-rock")).not.toBeInTheDocument();
    fireEvent.click(get("chevron-music"));
    expect(get("row-rock")).toBeInTheDocument();
    expect(events.events["item-collapse"]["rock"]).toBeDefined();
    fireEvent.click(get("chevron-music"));
    expect(query("row-rock")).not.toBeInTheDocument();

    expect(events.events["item-collapse"]["rock"]).toBeUndefined();
  });

  it("with an open music folder shows rock content ", () => {
    const rock = folder("rock");
    const music = folder("music", [rock.id]);
    music.isCollapsedInGallery = false;
    const home = folder("HOME", [music.id]);
    items.itemsLoaded({
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
