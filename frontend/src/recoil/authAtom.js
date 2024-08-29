import { atom } from "recoil";
// import { recoilPersist } from "recoil-persist";

// const { persistAtom } = recoilPersist({
//   key: "auth",
//   storage: sessionStorage,
// });

export class Auth {
  constructor(username = null, email = null, isLogin = false, role = "GUEST") {
    this.username = username;
    this.email = email;
    this.isLogin = isLogin;
    this.role = role;
  }
}

export const authAtom = atom({
  key: "author",
  /** @type {Auth} */
  default: null,
  // effects_UNSTABLE: [persistAtom],
});
