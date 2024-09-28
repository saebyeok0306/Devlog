import { atom } from "recoil";
// import { recoilPersist } from "recoil-persist";

// const { persistAtom } = recoilPersist({
//   key: "auth",
//   storage: sessionStorage,
// });

export class Auth {
  constructor(
    username = null,
    email = null,
    isLogin = false,
    role = "GUEST",
    profileUrl = null,
    provider = null,
    certificate = false
  ) {
    this.username = username;
    this.email = email;
    this.isLogin = isLogin;
    this.role = role;
    this.profileUrl = profileUrl;
    this.provider = provider;
    this.certificate = certificate;
  }
}

export const authAtom = atom({
  key: "author",
  /** @type {Auth} */
  default: new Auth(),
  // effects_UNSTABLE: [persistAtom],
});
