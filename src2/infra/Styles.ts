export type Styles = Partial<{
  //sizing
  height: number | "100vh";
  width: number | "100vw";

  //margins and paddings
  margin: 0 | string;
  marginRight: number | "-100%";
  marginLeft: number;
  marginTop: number;
  marginBottom: number;

  color: string;
  opacity: number;
  lineHeight: number;
  fontSize: number;
  zIndex: number;
  fontWeight: number;

  overflow: "hidden" | "auto" | "scroll";

  flex: number;
  display: "flex";
  flexDirection: "row" | "column";

  //colors
  backgroundColor: string;

  //transitions
  transition: string;
}>;
