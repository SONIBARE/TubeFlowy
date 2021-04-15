import { cls, colors, dom } from "../infra";
import { player } from "./domain";
export const renderPlayerFooter = () => {
  const span = dom.span({}, "");

  const updateState = (item: Item) => {
    span.textContent = item.title;
  };

  const cleanup = player.onAnyItemPlay(updateState);
  return dom.div(
    {
      onRemovedFromDom: cleanup,
      style: {
        position: "fixed",
        top: 20,
        right: 28,
        backgroundColor: colors.superLight,
        padding: 10,
      },
    },
    span
  );
};
