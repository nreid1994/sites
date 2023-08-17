import { Component, FormEvent } from "react";
import { sanitize } from "isomorphic-dompurify";
import { HomeController, HomeProps, HomeState } from "./home_interface";
import { template } from "./home_template";
import { HomeService } from "../../services/home_service";
import { AuthService } from "../../../auth/services/auth_service";

export class Home
  extends Component<HomeProps, HomeState>
  implements HomeController
{
  private readonly authService = AuthService.getInstance();
  private readonly homeService = HomeService.getInstance();
  private unsubscribeSessionResponse = () => {};
  private clearSessionInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: HomeProps) {
    super(props);
    this.state = { 
      session_id: undefined,
      showSpinner: false,
     };
  }

  componentDidMount(): void {
    this.unsubscribeSessionResponse = this.homeService.onSessionResponse(
      (response) => {
        if (response.session_id) {
          this.setState({ session_id: response.session_id });
        }
      }
    );

    // Refresh Session every thirty seconds.
    this.homeService.feedSession({});
    this.clearSessionInterval = window.setInterval(() => {
      this.homeService.feedSession({ session_id: this.state.session_id });
    }, 30000);

    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    window.clearInterval(this.clearSessionInterval);
    this.unsubscribeSessionResponse();

    this.homeService.feedSession({
      session_id: this.state.session_id,
      destroy: true,
    });
  };

  readonly handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const getCanLogin = this.authService.canLogin();
    if (!getCanLogin.canLogin) {
      alert(
        `You are not permitted to login for ${getCanLogin.howLongToWaitInMinutes}`
      );
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const username = sanitize(formData.get("username")?.toString() ?? "");
    const password = sanitize(formData.get("password")?.toString() ?? "");
    const rememberMe = !!formData.get("rememberMe")?.toString();

    this.authService.feedLogin({
      username,
      password,
      rememberMe,
    });

    this.setState({ showSpinner: true });
  };
}
