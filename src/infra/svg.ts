import { dom, fragment } from ".";
import {
  ElementProps,
  assignClasses,
  assignElementProps,
  ElementWithClassDefinitions,
} from "./dom";

export interface SvgProps extends ElementProps<SVGSVGElement> {
  viewBox: string;
  fill?: string;
}
export const svg = (
  props: SvgProps,
  ...child: (SVGElement | false)[]
): SVGSVGElement => {
  const mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  mySvg.setAttribute("viewBox", props.viewBox);
  if (props.fill) mySvg.setAttribute("fill", props.fill);
  mySvg.appendChild(fragment(child));
  assignElementProps(mySvg, props);
  return mySvg;
};

export interface CircleProps extends ElementProps<SVGCircleElement> {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
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

  if (circleProps.stroke) myCircle.setAttribute("stroke", circleProps.stroke);
  if (circleProps.strokeWidth)
    myCircle.setAttribute("stroke-width", circleProps.strokeWidth + "");
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

export interface PolygonProps extends ElementWithClassDefinitions {
  points: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokelinejoin?: "round";
}
export const polygon = (props: PolygonProps) => {
  const elem = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  elem.setAttribute("points", props.points);
  if (props.strokelinejoin)
    elem.setAttribute("stroke-linejoin", props.strokelinejoin);
  if (props.stroke) elem.setAttribute("stroke", props.stroke);
  if (props.fill) elem.setAttribute("fill", props.fill);
  if (props.strokeWidth)
    elem.setAttribute("stroke-width", props.strokeWidth + "");
  dom.assignClasses(elem, props);
  return elem;
};
