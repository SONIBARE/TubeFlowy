export interface SlapstukMouseEvent<T extends EventTarget> extends MouseEvent {
  currentTarget: T;
}
export interface SlapstukFocusEvent<T extends EventTarget> extends FocusEvent {
  currentTarget: T;
}
export interface SlaptukEvent<T extends EventTarget> extends Event {
  currentTarget: T;
}
export interface SlapstukKeyboardEvent<T extends EventTarget>
  extends KeyboardEvent {
  currentTarget: T;
}

export interface SlapstukEvents<T extends EventTarget> {
  // abort: (e: UIEvent) => void;
  // animationcancel: (e: AnimationEvent) => void;
  // animationend: (e: AnimationEvent) => void;
  // animationiteration: (e: AnimationEvent) => void;
  // animationstart: (e: AnimationEvent) => void;
  // auxclick: (e: MouseEvent) => void;
  // beforeinput: (e: InputEvent) => void;
  // blur: (e: FocusEvent) => void;
  // cancel: (e: Event) => void;
  // canplay: (e: Event) => void;
  // canplaythrough: (e: Event) => void;
  // change: (e: Event) => void;
  click: (e: SlapstukMouseEvent<T>) => void;
  // close: (e: Event) => void;
  // compositionend: (e: CompositionEvent) => void;
  // compositionstart: (e: CompositionEvent) => void;
  // compositionupdate: (e: CompositionEvent) => void;
  // contextmenu: (e: MouseEvent) => void;
  // cuechange: (e: Event) => void;
  // dblclick: (e: MouseEvent) => void;
  // drag: (e: DragEvent) => void;
  // dragend: (e: DragEvent) => void;
  // dragenter: (e: DragEvent) => void;
  // dragexit: (e: Event) => void;
  // dragleave: (e: DragEvent) => void;
  // dragover: (e: DragEvent) => void;
  // dragstart: (e: DragEvent) => void;
  // drop: (e: DragEvent) => void;
  // durationchange: (e: Event) => void;
  // emptied: (e: Event) => void;
  // ended: (e: Event) => void;
  // error: (e: ErrorEvent) => void;
  focus: (e: SlapstukFocusEvent<T>) => void;
  focusin: (e: SlapstukFocusEvent<T>) => void;
  focusout: (e: SlapstukFocusEvent<T>) => void;
  // gotpointercapture: (e: PointerEvent) => void;
  input: (e: SlaptukEvent<T>) => void;
  // invalid: (e: Event) => void;
  keydown: (e: SlapstukKeyboardEvent<T>) => void;
  keypress: (e: SlapstukKeyboardEvent<T>) => void;
  keyup: (e: SlapstukKeyboardEvent<T>) => void;
  // load: (e: Event) => void;
  // loadeddata: (e: Event) => void;
  // loadedmetadata: (e: Event) => void;
  // loadstart: (e: Event) => void;
  // lostpointercapture: (e: PointerEvent) => void;
  mousedown: (e: SlapstukMouseEvent<T>) => void;
  mouseenter: (e: SlapstukMouseEvent<T>) => void;
  mouseleave: (e: SlapstukMouseEvent<T>) => void;
  mousemove: (e: SlapstukMouseEvent<T>) => void;
  mouseout: (e: SlapstukMouseEvent<T>) => void;
  mouseover: (e: SlapstukMouseEvent<T>) => void;
  mouseup: (e: SlapstukMouseEvent<T>) => void;
  // pause: (e: Event) => void;
  // play: (e: Event) => void;
  // playing: (e: Event) => void;
  // pointercancel: (e: PointerEvent) => void;
  // pointerdown: (e: PointerEvent) => void;
  // pointerenter: (e: PointerEvent) => void;
  // pointerleave: (e: PointerEvent) => void;
  // pointermove: (e: PointerEvent) => void;
  // pointerout: (e: PointerEvent) => void;
  // pointerover: (e: PointerEvent) => void;
  // pointerup: (e: PointerEvent) => void;
  // progress: (e: ProgressEvent) => void;
  // ratechange: (e: Event) => void;
  // reset: (e: Event) => void;
  // resize: (e: UIEvent) => void;
  // scroll: (e: Event) => void;
  // securitypolicyviolation: (e: SecurityPolicyViolationEvent) => void;
  // seeked: (e: Event) => void;
  // seeking: (e: Event) => void;
  // select: (e: Event) => void;
  // selectionchange: (e: Event) => void;
  // selectstart: (e: Event) => void;
  // stalled: (e: Event) => void;
  // submit: (e: Event) => void;
  // suspend: (e: Event) => void;
  // timeupdate: (e: Event) => void;
  // toggle: (e: Event) => void;
  // touchcancel: (e: TouchEvent) => void;
  // touchend: (e: TouchEvent) => void;
  // touchmove: (e: TouchEvent) => void;
  // touchstart: (e: TouchEvent) => void;
  // transitioncancel: (e: TransitionEvent) => void;
  // transitionend: (e: TransitionEvent) => void;
  // transitionrun: (e: TransitionEvent) => void;
  // transitionstart: (e: TransitionEvent) => void;
  // volumechange: (e: Event) => void;
  // waiting: (e: Event) => void;
  // wheel: (e: WheelEvent) => void;
}
