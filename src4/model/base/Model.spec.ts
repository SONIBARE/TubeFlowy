import Model from "./Model";

type Square = {
  type: "square";
  x: number;
  y: number;
  side: number;
};

type Circle = {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
};

type Polygon = {
  type: "polygon";
  points: { x: number; y: number }[];
};

type Figure = Square | Circle | Polygon;

class CircleModel extends Model<Circle> {}
class SquareModel extends Model<Square> {}

type FigureModel = CircleModel | SquareModel;

it("sample model", () => {
  const figureModels: FigureModel[] = [
    new CircleModel({
      type: "circle",
      cx: 2,
      cy: 3,
      r: 5,
    }),
  ];

  const first = figureModels[0];

  if (isCircle(first)) first.get("cx"); //?
});

const isCircle = (
  model: Model<{ type: Figure["type"] }>
): model is CircleModel => model.get("type") == "circle";

const isSquare = (
  model: Model<{ type: Figure["type"] }>
): model is CircleModel => model.get("type") == "square";
