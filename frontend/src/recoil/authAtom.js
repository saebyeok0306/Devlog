import { atom } from "recoil";

export class Auth {
  constructor(
    username = null,
    email = null,
    isLogin = false,
    role = "GUEST",
    profileUrl = null,
    provider = null,
    certificate = false,
    about = "자기소개를 작성해주세요."
  ) {
    this.username = username;
    this.email = email;
    this.isLogin = isLogin;
    this.role = role;
    this.profileUrl = profileUrl;
    this.provider = provider;
    this.certificate = certificate;
    this.about = about;
  }
}

export const authAtom = atom({
  key: "author",
  /** @type {Auth} */
  default: new Auth(),
  // effects_UNSTABLE: [persistAtom],
});
