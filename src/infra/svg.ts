import { fragment } from ".";
import { ElementProps, assignClasses, assignElementProps } from "./dom";

export interface SvgProps extends ElementProps {
  viewBox: string;
  fill?: string;
}
export const svg = (props: SvgProps, ...child: SVGElement[]): SVGSVGElement => {
  const mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  mySvg.setAttribute("viewBox", props.viewBox);
  if (props.fill) mySvg.setAttribute("fill", props.fill);
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

export interface PathProps {
  d: string;
  fill?: string;
  stroke?: string;
  strokeLinecap?: string;
}
export const path = (props: PathProps) => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", props.d);
  if (props.fill) path.setAttribute("fill", props.fill);
  if (props.stroke) path.setAttribute("stroke", props.stroke);
  if (props.strokeLinecap)
    path.setAttribute("stroke-linecap", props.strokeLinecap);

  return path;
};
