import { Component, FormEvent } from "react";
import { template } from "./delete_user_template";
import { sanitize } from "isomorphic-dompurify";
import {
  DeleteUserProps,
  DeleteUserController,
  DeleteUserState,
} from "./delete_user_interface";
import { AdminService } from "../../services/admin_service";

export class DeleteUser
  extends Component<DeleteUserProps, DeleteUserState>
  implements DeleteUserController
{
  private readonly adminService = AdminService.getInstance();
  private unsubscribeDeleteUserResponse = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: DeleteUserProps) {
    super(props);
    this.state = { showSpinner: false };
  }

  componentDidMount(): void {
    this.unsubscribeDeleteUserResponse =
      this.adminService.onDeleteUserResponse((response) => {
        this.setState({ showSpinner: false });

        if (response.error) alert(response.error);
        else {
          alert("User will be forced to logout on there next network request");
          (
            document.getElementById("deleteUserForm") as HTMLFormElement
          ).reset();
        }
      });

    document.addEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeDeleteUserResponse();
  };

  readonly onDeleteUserSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const usernameOrId = sanitize(
      formData.get("usernameOrId")?.toString() ?? ""
    );

    this.adminService.feedDeleteUser({ name_or_id: usernameOrId });
    this.setState({ showSpinner: true });
  };
}
