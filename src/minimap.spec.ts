import { fireEvent } from "@testing-library/dom";
import { spacings } from "./infra";
import { Minimap, minimap } from "./minimap";
import { items } from "./domain";

const folder = (id: string, children?: string[]): Folder => ({
  id: id,
  title: id,
  type: "folder",
  children: children || [],
});

const clearBody = () => (document.body.innerHTML = ``);

//@ts-expect-error
window.requestAnimationFrame = (cb) => cb();

describe("Minimap specs", () => {
  let map: Minimap;
  let scrollTo: jest.Mock;
  let container: HTMLElement;

  afterEach(clearBody);

  beforeEach(() => {
    items.itemsLoaded({ HOME: folder("HOME") });
    container = document.createElement("div");
    scrollTo = jest.fn();
    container.scrollTo = scrollTo;
    jest
      .spyOn(container, "scrollHeight", "get")
      .mockImplementation(() => 10000);

    map = minimap(container);
    document.body.appendChild(map);
  });

  it("by default track top should be zero", () => {
    expect(map.track.style.top).toBe("0px");
  });

  describe("", () => {
    const windowHeight = 768;
    const minimapHeight =
      windowHeight - spacings.headerHeight - spacings.playerFooterHeight;
    const expectedTrackHeight = minimapHeight / 8;

    beforeEach(() => {
      jest
        .spyOn(map, "clientHeight", "get")
        .mockImplementation(() => minimapHeight);
    });

    it("height of a minimap track is proportion to a window height", () => {
      expect(map.track.style.height).toBe(expectedTrackHeight + "px");
    });

    it("height of a minimap is proportion to a scroll container height", () => {
      const pageSize = 10000;
      const expectedTrackHeight = pageSize / 8;
      expect(map.canvas.height).toBe(expectedTrackHeight);
    });

    it("moving minimap track down by 50px should scroll and move canvas", () => {
      scrollTo.mockClear();
      mouseDownAndMoveBy(map.track, {
        movementX: 0,
        movementY: 50,
      });

      //wtf is this magic numbers
      expect(scrollTo).toHaveBeenCalledWith({ top: 794.4645518416011 });
      expect(map.track.style.top).toBe("50px");
      expect(map.canvas.style.top).toBe("-49.308068980200126px");
    });

    describe("scrolling page by 2000px", () => {
      beforeEach(() => {
        jest
          .spyOn(container, "scrollTop", "get")
          .mockImplementation(() => 2000);

        fireEvent.scroll(container);
      });

      it("should move track on a minimap", () => {
        expect(map.track.style.top).toBe("125.87094007932255px");
        expect(map.canvas.style.top).toBe("-124.12905992067746px");
      });

      describe("moving then track by 50 px", () => {
        beforeEach(() => {
          mouseDownAndMoveBy(map.track, {
            movementX: 0,
            movementY: 50,
          });
        });
        it("should move track on a minimap even further", () => {
          expect(map.track.style.top).toBe("175.87094007932257px");
          expect(map.canvas.style.top).toBe("-173.4371289008776px");
        });
      });
    });
  });
});

describe("Having a content shorter than minimap", () => {
  let map: Minimap;
  let scrollTo: jest.Mock;
  let container: HTMLElement;

  afterEach(clearBody);

  beforeEach(() => {
    items.itemsLoaded({ HOME: folder("HOME") });
    container = document.createElement("div");
    scrollTo = jest.fn();
    container.scrollTo = scrollTo;
    jest.spyOn(container, "scrollHeight", "get").mockImplementation(() => 1000);
    map = minimap(container);
    document.body.appendChild(map);
    const windowHeight = 768;
    const minimapHeight =
      windowHeight - spacings.headerHeight - spacings.playerFooterHeight;
    jest
      .spyOn(map, "clientHeight", "get")
      .mockImplementation(() => minimapHeight);
  });

  it("moving minimap track down by 10px should scroll and move canvas", () => {
    scrollTo.mockClear();
    mouseDownAndMoveBy(map.track, {
      movementX: 0,
      movementY: 10,
    });
    expect(scrollTo).toHaveBeenCalledWith({ top: 80 });
    expect(map.track.style.top).toBe("10px");
    expect(map.canvas.style.top).toBe("0px");
  });
});
interface MoveEventProps {
  movementX: number;
  movementY: number;
}

const mouseDownAndMoveBy = (
  itemToMouseDown: HTMLElement,
  eventProps: MoveEventProps
) => {
  fireEvent.mouseDown(itemToMouseDown);
  const event = new MouseEvent("mousemove");
  jest.spyOn(event, "buttons", "get").mockImplementation(() => 1);
  //@ts-expect-error
  event.movementY = eventProps.movementY;
  //@ts-expect-error
  event.movementX = eventProps.movementX;
  fireEvent(document, event);
};
