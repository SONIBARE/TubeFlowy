import { ReadonlyItemModel } from "../model/ItemModel";
import PlayerView from "./PlayerView";
import * as youtubePlayer from "./youtubePlayer";

class Player {
  view: PlayerView;
  currentItemPlayed?: ReadonlyItemModel;
  constructor(private container: Element) {
    this.view = new PlayerView(this.container);
    youtubePlayer.on({
      onEnd: this.playeNextTrack,
    });
  }
  play = (model: ReadonlyItemModel) => {
    this.currentItemPlayed = model;
    const videoId = model.get("videoId");
    if (videoId) youtubePlayer.play(videoId);
  };

  playeNextTrack = () => {
    console.log("playeNextTrack");
    if (this.currentItemPlayed) {
      const parent = this.currentItemPlayed.parent;
      if (parent) {
        const children = parent.getChildren() as ReadonlyItemModel[];
        const index = children.indexOf(this.currentItemPlayed);
        if (index < children.length - 1) {
          this.play(children[index + 1]);
        }
      }
    }
  };
}

export default Player;
