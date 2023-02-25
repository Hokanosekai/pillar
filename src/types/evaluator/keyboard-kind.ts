export enum KeyboardKind {
  // Modifier keys
  Shift                           = "SHIFT",
  Ctrl                            = "CTRL",
  Control                         = "CONTROL",
  Alt                             = "ALT",
  Windows                         = "WINDOWS",
  Gui                             = "GUI",
  CtrlAlt                         = "CTRL-ALT",
  CtrlShift                       = "CTRL-SHIFT",
  AltGui                          = "ALT-GUI",
  GuiShift                        = "GUI-SHIFT",
  GuiCtrl                         = "GUI-CTRL",

  // Numpad keys
  AltChar                         = "ALTCHAR",
  AltString                       = "ALTSTRING",
  AltCode                         = "ALTCODE",

  // Keyboard
  ArrowDown                       = "ARROWDOWN",
  ArrowLeft                       = "ARROWLEFT",
  ArrowRight                      = "ARROWRIGHT",
  ArrowUp                         = "ARROWUP",
  Down                            = "DOWN",
  Left                            = "LEFT",
  Right                           = "RIGHT",
  Up                              = "UP",
  Enter                           = "ENTER",
  Delete                          = "DELETE",
  BackSpace                       = "BACKSPACE",
  End                             = "END",
  Home                            = "HOME",
  Escape                          = "ESCAPE",
  Esc                             = "ESC",
  Insert                          = "INSERT",
  PageUp                          = "PAGEUP",
  PageDown                        = "PAGEDOWN",
  CapsLock                        = "CAPSLOCK",
  NumLock                         = "NUMLOCK",
  ScrollLock                      = "SCROLLLOCK",
  PrintScreen                     = "PRINTSCREEN",
  Pause                           = "PAUSE",
  Break                           = "BREAK",
  Space                           = "SPACE",
  Tab                             = "TAB",
  Menu                            = "MENU",
  App                             = "APP",

  // Functional keys
  F1                              = "F1",
  F2                              = "F2",
  F3                              = "F3",
  F4                              = "F4",
  F5                              = "F5",
  F6                              = "F6",
  F7                              = "F7",
  F8                              = "F8",
  F9                              = "F9",
  F10                             = "F10",
  F11                             = "F11",
  F12                             = "F12",

  // Single character keys
  A                               = "A",
  B                               = "B",
  C                               = "C",
  D                               = "D",
  E                               = "E",
  F                               = "F",
  G                               = "G",
  H                               = "H",
  I                               = "I",
  J                               = "J",
  K                               = "K",
  L                               = "L",
  M                               = "M",
  N                               = "N",
  O                               = "O",
  P                               = "P",
  Q                               = "Q",
  R                               = "R",
  S                               = "S",
  T                               = "T",
  U                               = "U",
  V                               = "V",
  W                               = "W",
  X                               = "X",
  Y                               = "Y",
  Z                               = "Z",

  None                            = "None",
}

export const IsModifierKey = (key: KeyboardKind): boolean => {
  switch (key) {
    case KeyboardKind.Shift:
    case KeyboardKind.Ctrl:
    case KeyboardKind.Control:
    case KeyboardKind.Alt:
    case KeyboardKind.Windows:
    case KeyboardKind.Gui:
    case KeyboardKind.CtrlAlt:
    case KeyboardKind.CtrlShift:
    case KeyboardKind.AltGui:
    case KeyboardKind.GuiShift:
    case KeyboardKind.GuiCtrl:
      return true;
    default:  
      return false;
  }
}

export const IsNumpadKey = (key: KeyboardKind): boolean => {
  switch (key) {
    case KeyboardKind.AltChar:
    case KeyboardKind.AltString:
    case KeyboardKind.AltCode:
      return true;
    default:
      return false;
  }
}

export const GetKeyboardKind = (text: string): KeyboardKind => {
  switch (text) {
    // Modifier keys
    case "SHIFT":               return KeyboardKind.Shift;
    case "CTRL":                return KeyboardKind.Ctrl;
    case "CONTROL":             return KeyboardKind.Control;
    case "ALT":                 return KeyboardKind.Alt;
    case "WINDOWS":             return KeyboardKind.Windows;
    case "GUI":                 return KeyboardKind.Gui;
    case "CTRL-ALT":            return KeyboardKind.CtrlAlt;
    case "CTRL-SHIFT":          return KeyboardKind.CtrlShift;
    case "ALT-GUI":             return KeyboardKind.AltGui;
    case "GUI-SHIFT":           return KeyboardKind.GuiShift;
    case "GUI-CTRL":            return KeyboardKind.GuiCtrl;

    // Numpad keys
    case "ALTCHAR":             return KeyboardKind.AltChar;
    case "ALTSTRING":           return KeyboardKind.AltString;
    case "ALTCODE":             return KeyboardKind.AltCode;

    // Keyboard
    case "ARROWDOWN":           return KeyboardKind.ArrowDown;
    case "ARROWLEFT":           return KeyboardKind.ArrowLeft;
    case "ARROWRIGHT":          return KeyboardKind.ArrowRight;
    case "ARROWUP":             return KeyboardKind.ArrowUp;
    case "DOWN":                return KeyboardKind.Down;
    case "LEFT":                return KeyboardKind.Left;
    case "RIGHT":               return KeyboardKind.Right;
    case "UP":                  return KeyboardKind.Up;
    case "ENTER":               return KeyboardKind.Enter;
    case "DELETE":              return KeyboardKind.Delete;
    case "BACKSPACE":           return KeyboardKind.BackSpace;
    case "END":                 return KeyboardKind.End;
    case "HOME":                return KeyboardKind.Home;
    case "ESCAPE":              return KeyboardKind.Escape;
    case "ESC":                 return KeyboardKind.Esc;
    case "INSERT":              return KeyboardKind.Insert;
    case "PAGEUP":              return KeyboardKind.PageUp;
    case "PAGEDOWN":            return KeyboardKind.PageDown;
    case "CAPSLOCK":            return KeyboardKind.CapsLock;
    case "NUMLOCK":             return KeyboardKind.NumLock;
    case "SCROLLLOCK":          return KeyboardKind.ScrollLock;
    case "PRINTSCREEN":         return KeyboardKind.PrintScreen;
    case "PAUSE":               return KeyboardKind.Pause;
    case "BREAK":               return KeyboardKind.Break;
    case "SPACE":               return KeyboardKind.Space;
    case "TAB":                 return KeyboardKind.Tab;
    case "MENU":                return KeyboardKind.Menu;
    case "APP":                 return KeyboardKind.App;

    // Functional keys
    case "F1":                  return KeyboardKind.F1;
    case "F2":                  return KeyboardKind.F2;
    case "F3":                  return KeyboardKind.F3;
    case "F4":                  return KeyboardKind.F4;
    case "F5":                  return KeyboardKind.F5;
    case "F6":                  return KeyboardKind.F6;
    case "F7":                  return KeyboardKind.F7;
    case "F8":                  return KeyboardKind.F8;
    case "F9":                  return KeyboardKind.F9;
    case "F10":                 return KeyboardKind.F10;
    case "F11":                 return KeyboardKind.F11;
    case "F12":                 return KeyboardKind.F12;

    // Single character keys
    case "A":                   return KeyboardKind.A;
    case "B":                   return KeyboardKind.B;
    case "C":                   return KeyboardKind.C;
    case "D":                   return KeyboardKind.D;
    case "E":                   return KeyboardKind.E;
    case "F":                   return KeyboardKind.F;
    case "G":                   return KeyboardKind.G;
    case "H":                   return KeyboardKind.H;
    case "I":                   return KeyboardKind.I;
    case "J":                   return KeyboardKind.J;
    case "K":                   return KeyboardKind.K;
    case "L":                   return KeyboardKind.L;
    case "M":                   return KeyboardKind.M;
    case "N":                   return KeyboardKind.N;
    case "O":                   return KeyboardKind.O;
    case "P":                   return KeyboardKind.P;
    case "Q":                   return KeyboardKind.Q;
    case "R":                   return KeyboardKind.R;
    case "S":                   return KeyboardKind.S;
    case "T":                   return KeyboardKind.T;
    case "U":                   return KeyboardKind.U;
    case "V":                   return KeyboardKind.V;
    case "W":                   return KeyboardKind.W;
    case "X":                   return KeyboardKind.X;
    case "Y":                   return KeyboardKind.Y;
    case "Z":                   return KeyboardKind.Z;

    default:                    return KeyboardKind.None;
  }
}