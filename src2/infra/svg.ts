import {
  ReadonlyClassDefinitions,
  assignReadonlyClasses,
  Events,
  assignEvents,
} from "./dom";
import { camelToSnakeCase } from "./style";
type BaseSvg = ReadonlyClassDefinitions & Events;

export interface SvgProps extends BaseSvg {
  viewBox: string;
  fill?: string;
  children: SVGElement[];
}
export const svg = (props: SvgProps): SVGSVGElement =>
  appendChildren(
    assignEvents(assignSvgAttributes(svgElem("svg"), props), props),
    props.children
  );

export interface CircleProps extends ReadonlyClassDefinitions {
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}
export const circle = (circleProps: CircleProps) =>
  assignSvgAttributes(svgElem("circle"), circleProps);

export interface PolygonProps extends ReadonlyClassDefinitions {
  points: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinejoin?: "round";
}
export const polygon = (props: PolygonProps) =>
  assignSvgAttributes(svgElem("polygon"), props);

export interface PathProps extends ReadonlyClassDefinitions {
  d: string;
  fill?: string;
  stroke?: string;
  strokeLinecap?: string;
}
export const path = (props: PathProps) =>
  assignSvgAttributes(svgElem("path"), props);

//SVG infra

const svgAttributesIgnored: Record<string, boolean> = {
  children: true,
  className: true,
};

const attributesInPascal: Record<string, boolean> = {
  viewBox: true,
};
const assignSvgAttributes = <T extends Element>(elem: T, attributes: {}): T => {
  assignReadonlyClasses(elem, attributes);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value && !svgAttributesIgnored[key]) {
      const keyConverted = attributesInPascal[key]
        ? key
        : camelToSnakeCase(key);
      elem.setAttribute(keyConverted, value + "");
    }
  });
  return elem;
};

type Elems = {
  svg: SVGSVGElement;
  polygon: SVGPathElement;
  path: SVGPathElement;
  circle: SVGCircleElement;
};

const svgElem = <T extends keyof Elems>(name: T): Elems[T] =>
  document.createElementNS("http://www.w3.org/2000/svg", name) as Elems[T];

const appendChildren = <T extends SVGElement>(
  elem: T,
  children: SVGElement[] | undefined
): T => {
  if (children) children.forEach((child) => elem.appendChild(child));
  return elem;
};
