import { ChangeEvent, Component, FormEvent, MouseEvent } from "react";
import {
  ProfileAboutController,
  ProfileAboutProps,
  ProfileAboutState,
} from "./profile_about_interface";
import { template } from "./profile_about_template";
import { sanitize } from "isomorphic-dompurify";

export class ProfileAbout
  extends Component<ProfileAboutProps, ProfileAboutState>
  implements ProfileAboutController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ProfileAboutProps) {
    super(props);
    this.state = { about: props.about };
  }

  readonly aboutFormat = (about: string) => {
    return about.slice(0, 1000);
  };
}
