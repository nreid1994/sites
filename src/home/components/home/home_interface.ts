import { FormEvent } from "react";

export interface HomeProps {}
export interface HomeState {
  session_id?: string;
  showSpinner: boolean;
}
export interface HomeController {
  handleSubmit: (event: FormEvent) => void;
}
