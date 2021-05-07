export type Styles = Partial<{
  //display
  opacity: number;

  //sizing
  height: number | "100vh";
  width: number | "100vw";

  //margins and paddings
  margin: 0;
  marginRight: number | "-100%";
  marginLeft: number;
  marginTop: number;
  marginBottom: number;
  padding: 0;
  paddingRight: number;
  paddingLeft: number | string;
  paddingTop: number;
  paddingBottom: number;

  //positioning
  position: "absolute" | "relative";
  zIndex: number;
  overflow: "hidden" | "auto" | "scroll";

  //flex
  flex: number;
  display: "flex";
  flexDirection: "row" | "column";
  justifyItems: "flex-start" | "center" | "flex-end";
  alignItems: "flex-start" | "center" | "flex-end";

  //colors
  backgroundColor: string;

  //transitions
  transition: string;

  //typography
  fontFamily: string;
  color: string;
  lineHeight: number;
  fontSize: number;
  fontWeight: "bold";
}>;
