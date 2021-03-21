const outerRadius = 10;
const innerRadius = 4.5;
const chevronSize = 16;
const borderSize = 2;

export const spacings = {
  outerRadius,
  chevronSize,
  innerRadius,
  borderSize,
  rowLeftPadding: chevronSize / 2,
  spacePerLevel: chevronSize + outerRadius - borderSize / 2,
  negativeMarginForRowAtZeroLevel: 1000,
  rowVecticalPadding: 4,
  spaceBetweenCircleAndText: 4,
  headerHeight: 48,
  bodyScrollWidth: 8,
  pageFontSize: 16,
  pageMarginTop: 20,
  documentWidth: 700,

  playerFooterHeight: 49,

  //CARDS
  cardHeight: 48,
  cardPadding: 14,
  cardWidth: 280,
  cardTextPadding: 4,
  cardTextBottomPadding: 2,
};

export const timings = {
  cardExpandCollapseDuration: 200,
};

export const colors = {
  darkPrimary: "#4C5155",
  mediumPrimary: "#B8BCBF",
  lightPrimary: "#DCE0E2",
  buttonHover: "#ECEEF0",
  border: "#ECEEF0",
  scrollBar: "rgb(42, 49, 53)",
};
