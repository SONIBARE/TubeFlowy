it.todo("f");
// import { items } from "../domain";
// import { createItemsFromArray, folder, video } from "../domain/testUtils";
// import * as player from "./playerFooter";
// import { play, pause, resume } from "./youtubePlayer";
// const playMock = play as jest.Mock;
// const pauseMock = pause as jest.Mock;
// const resumeMock = resume as jest.Mock;

// jest.mock("./youtubePlayer", () => ({
//   play: jest.fn(),
//   pause: jest.fn(),
//   resume: jest.fn(),
// }));

// const v1 = video("v1", "videoId1");
// const v2 = video("v2", "videoId2");
// const f3 = folder("f3");
// const f2 = folder("f2", [v1.id, v2.id]);
// const f1 = folder("f1", [f2.id, f3.id]);
// const home = folder("HOME", [f2.id]);

// /*
// ■ home
//  ■ f1
//   ■ f2
//    ■ v1
//    ■ v2
//   ■ f2
// */

// describe("havign two nested folder", () => {
//   beforeEach(() => {
//     [playMock, pauseMock, resumeMock].forEach((f) => f.mockReset());
//     items.itemsLoaded(createItemsFromArray([v1, f1, f2, f3, home]));
//     document.body.appendChild(player.playerFooter());
//   });
//   it("playing video should call youtube player with that videoid", () => {
//     player.playItem(v1);
//     expect(play).toHaveBeenCalledWith(v1.videoId);
//   });

//   it("f2 should call youtube player with the first video", () => {
//     player.playItem(f2);
//     expect(play).toHaveBeenCalledWith(v1.videoId);
//   });
//   it("f1 should call youtube player with the first video", () => {
//     player.playItem(f1);
//     expect(play).toHaveBeenCalledWith(v1.videoId);
//   });
//   it("f3 should not call youtube player with the first video", () => {
//     player.playItem(f3);
//     expect(play).not.toHaveBeenCalled();
//   });
// });
