import { fragment, Styles, ClassName } from ".";
import { assignStyles } from "./dom";

interface SvgProps {
  className?: ClassName;
  viewBox: string;
  style?: Styles;
}
export const svg = (
  { viewBox, style, className }: SvgProps,
  ...child: SVGElement[]
): Node => {
  const mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  mySvg.setAttribute("viewBox", viewBox);
  mySvg.appendChild(fragment(child));
  if (className) mySvg.classList.add(className);
  if (style) assignStyles((mySvg as unknown) as HTMLElement, style);
  return mySvg;
};

interface CircleProps {
  className?: ClassName;
  cx: number;
  cy: number;
  r: number;
  fill: string;
}
export const circle = (circleProps: CircleProps) => {
  const myCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  if (circleProps.className) myCircle.classList.add(circleProps.className);
  myCircle.setAttribute("cx", circleProps.cx + "");
  myCircle.setAttribute("cy", circleProps.cy + "");
  myCircle.setAttribute("r", circleProps.r + "");
  myCircle.setAttribute("fill", circleProps.fill);
  return myCircle;
};

interface PathProps {
  d: string;
  fill?: string;
}
export const path = (props: PathProps) => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", props.d);

  return path;
};
