import { fragment } from ".";
import { ElementProps, assignClasses, assignElementProps } from "./dom";

export interface SvgProps extends ElementProps {
  viewBox: string;
}
export const svg = (props: SvgProps, ...child: SVGElement[]): SVGSVGElement => {
  const mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  mySvg.setAttribute("viewBox", props.viewBox);
  mySvg.appendChild(fragment(child));
  assignElementProps(mySvg, props);
  return mySvg;
};

interface CircleProps extends ElementProps {
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
  assignClasses(myCircle, circleProps);
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
  if (props.fill) path.setAttribute("fill", props.fill);

  return path;
};
