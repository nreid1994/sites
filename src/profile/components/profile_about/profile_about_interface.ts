import { ChangeEvent, FormEvent, MouseEvent } from "react";

export interface ProfileAboutProps {
  about: string;
  isEditable: boolean;

  // Refresh Profile Parent.
  // onAboutComplete: (about: string) => void;
}

export interface ProfileAboutState {
  about: string;
}

export interface ProfileAboutController {
  aboutFormat: (about: string) => string;
  //   onAboutChange: () => void;
  //   onButtonClick: (event: MouseEvent) => void;
  //   onButtonClose: () => void;
}
