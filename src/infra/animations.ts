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
