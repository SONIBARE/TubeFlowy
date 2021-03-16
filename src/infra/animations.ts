import { timings } from "./constants";
import { convertNumericStylesToPixels, Styles } from "./style";

export const animate = (
  elem: HTMLElement,
  keyFrames: Styles[],
  options: KeyframeAnimationOptions
) =>
  elem.animate(
    keyFrames.map((s) => convertNumericStylesToPixels(s) as Keyframe),
    options
  );

export const expandHeight = (elem: HTMLElement) =>
  animate(
    elem,
    [
      { height: 0, opacity: 0 },
      { height: elem.clientHeight, opacity: 1 },
    ],
    { duration: timings.cardExpandCollapseDuration }
  );

export const collapseHeight = (elem: HTMLElement) =>
  animate(
    elem,
    [
      { height: elem.clientHeight, opacity: 1 },
      { height: 0, opacity: 0 },
    ],
    { duration: timings.cardExpandCollapseDuration }
  );

export const revertCurrentAnimations = (elem: HTMLElement): boolean => {
  const animations = elem.getAnimations();
  if (animations.length > 0) {
    animations.forEach((anim) => anim.reverse());
    return true;
  }
  return false;
};
