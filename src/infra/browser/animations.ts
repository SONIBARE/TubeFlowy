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

export const expandHeight = (elem: HTMLElement, duration: number) =>
  animate(
    elem,
    [
      { height: 0, opacity: 0, overflow: "hidden" },
      { height: elem.clientHeight, opacity: 1, overflow: "hidden" },
    ],
    { duration }
  );

export const collapseHeight = (elem: HTMLElement, duration: number) =>
  animate(
    elem,
    [
      { height: elem.clientHeight, opacity: 1, overflow: "hidden" },
      { height: 0, opacity: 0, overflow: "hidden" },
    ],
    { duration }
  );

export const revertCurrentAnimations = (elem: HTMLElement): boolean => {
  const animations = elem.getAnimations();
  if (animations.length > 0) {
    animations.forEach((anim) => anim.reverse());
    return true;
  }
  return false;
};
