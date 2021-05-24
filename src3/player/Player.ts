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
    if (this.currentItemPlayed) {
      const next = this.currentItemPlayed.getNextItem();
      if (next) this.play(next);
    }
  };
}

export default Player;
