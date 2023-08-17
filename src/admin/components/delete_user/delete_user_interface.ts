import { FormEvent } from "react";

export interface DeleteUserProps {}

export interface DeleteUserState {
  showSpinner: boolean;
}

export interface DeleteUserController {
  onDeleteUserSubmit: (event: FormEvent) => void;
}
