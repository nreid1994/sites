import { User } from "../../../contrib/lib";
import { UserType } from "../../../contrib/lib";

export interface ProfileTopProps {
  user: User;
  isEditable: boolean;
}

export interface ProfileTopState {
  url: string;
}

export interface ProfileTopController {
  userEmailHash: string;
}
