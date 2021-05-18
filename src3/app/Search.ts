import { findYoutubeVideos, ResponseItem } from "../api/youtubeRequest";
import { cls, css, style, dom, cssVar } from "../browser";
import { timings, levels } from "../designSystem";
import { ItemCollection, ItemModel } from "../model/ItemModel";
import { UiStateModel } from "../model/UserSettingsModel";
import FocusModel from "./FocusModel";
import { Tree } from "./tree/Tree";

type Props = {
  container: Element;
  model: UiStateModel;
  focusModel: FocusModel;
};
class Search {
  input: HTMLInputElement;
  searchContent = dom.div({});
  searchRoot?: ItemModel;

  constructor(private props: Props) {
    this.input = dom.input({
      className: cls.searchInput,
      placeholder: "Search on Youtube...",
      onKeyDown: this.searchOnEnter,
    });
    props.container.appendChild(
      dom.div({ className: levels.classForLevel(0), children: [this.input] })
    );
    props.container.appendChild(this.searchContent);
    props.model.on("isSearchVisibleChanged", this.updateSearch);
  }

  updateSearch = (isVisible: boolean) => {
    if (isVisible)
      setTimeout(() => this.input.focus(), timings.searchHideDuration);
  };

  searchOnEnter = (e: dom.KeyboardEventOn<HTMLInputElement>) => {
    if (e.code === "Enter") {
      findYoutubeVideos(e.currentTarget.value).then((response) => {
        const searchRoot = new ItemModel({
          isOpen: true,
          title: "Search",
          type: "folder",
          children: new ItemCollection(response.items.map(mapReponseItem)),
        });
        //TODO: Bug here, Tree assumes main focus context
        const tree = new Tree(this.searchContent, this.props.focusModel);
        tree.focus(searchRoot);
      });
      console.log("searchging on", e.currentTarget.value);
    }
  };
}

style.class(cls.searchTab, {
  flex: 1,
  transition: css.transition({ marginRight: timings.searchHideDuration }),
  overflowY: "overlay",
  overflowX: "hidden",
});

style.class(cls.searchTabHidden, { marginRight: "-100%" });

css.createScrollStyles(cls.searchTab, {
  scrollbar: { width: 8 },
  thumb: {
    backgroundColor: css.useVar(cssVar.ambient),
  },
});

style.class(cls.searchInput, {
  width: 200,
  fontSize: 16,
  border: "none",
  boxSizing: "border-box",
});

export default Search;

const mapReponseItem = (item: ResponseItem): ItemModel => {
  if (item.itemType == "video")
    return new ItemModel({
      isOpen: false,
      title: item.name,
      type: "YTvideo",
      videoId: item.itemId,
    });
  else if (item.itemType == "channel")
    return new ItemModel({
      isOpen: false,
      title: item.name,
      type: "YTchannel",
      image: item.image,
    });
  else
    return new ItemModel({
      isOpen: false,
      title: item.name,
      type: "YTplaylist",
      image: item.image,
    });
};
