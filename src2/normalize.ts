import { style } from "./infra";

//core is taken from https://github.com/necolas/normalize.css/blob/master/normalize.css
//not using npm package cause I want full control over my resultings css
style.selector("body", {
  margin: 0,
});

style.selector("html", {
  lineHeight: 1.5,
});
