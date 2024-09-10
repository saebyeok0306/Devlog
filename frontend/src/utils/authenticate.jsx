import { Auth, authAtom } from "recoil/authAtom";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { clearAllCacheStore } from "api/Cache";
import { useEffect } from "react";
import { jwt_refresh_api, user_logout_api, user_profile_api } from "api/User";

export const signIn = async (setAuthDto, message = "로그인 성공!") => {
  try {
    let payload = await user_profile_api();
    payload = payload.data;
    setAuthDto(
      new Auth(
        payload.username,
        payload.email,
        true,
        payload.role,
        payload.profileUrl
      )
    );

    clearAllCacheStore(); // 캐시 초기화
    if (message !== false) toast.success(`${message}`, {});
    return true;
  } catch (error) {
    console.error("Failed to sign in:", error);
    return false;
  }
};

export const signOutProcess = async (setAuthDto) => {
  try {
    await user_logout_api();
    setAuthDto(new Auth());
    clearAllCacheStore(); // 캐시 초기화
    return true;
  } catch (error) {
    console.error("Failed to sign out:", error);
  }
  return false;
};

export const signOut = async (setAuthDto, message = "로그아웃 했습니다.") => {
  if (await signOutProcess(setAuthDto)) {
    toast.success(`${message}`, {});
  }
};

export const warnSignOut = async (
  setAuthDto,
  message = "로그인이 만료되었습니다."
) => {
  if (await signOutProcess(setAuthDto)) {
    toast.warning(`${message}`, {});
  }
};

export const GetPayload = () => {
  const [authDto, setAuthDto] = useRecoilState(authAtom);

  useEffect(() => {
    const checkUserdata = async () => {
      if (authDto?.isLogin) return;
      let payload = null;
      try {
        await jwt_refresh_api();
        const result = await user_profile_api();
        payload = result.data;
      } catch (error) {
        // console.error("Failed to get user data:", error);
        await signOutProcess(setAuthDto);
        // await warnSignOut(setAuthDto, "로그인이 만료되었습니다.");
        return;
      }
      setAuthDto(
        new Auth(
          payload.username,
          payload.email,
          true,
          payload.role,
          payload.profileUrl
        )
      );
    };

    checkUserdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return authDto;
};
