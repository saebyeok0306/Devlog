"use client";
import { Auth, authAtom } from "@/recoil/authAtom";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { clearAllCacheStore } from "@/api/cache";
import { useEffect } from "react";
import {
  has_jwt_cookie_api,
  jwt_refresh_api,
  user_logout_api,
  user_profile_api,
} from "@/api/user";

export const signIn = async (setAuthDto, message = "로그인 성공!") => {
  try {
    let res = await user_profile_api();
    const payload = res.data;
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

export const GetPayload = (setIsLoading = null, setMaintenance = null) => {
  const [authDto, setAuthDto] = useRecoilState(authAtom);

  useEffect(() => {
    const checkUserdata = async () => {
      if (authDto?.isLogin) return;
      try {
        const jwt = await has_jwt_cookie_api();
        if (!jwt) return;
        await jwt_refresh_api();
        const result = await user_profile_api();
        const payload = result.data;

        if (result.status === 200) {
          setAuthDto(
            new Auth(
              payload.username,
              payload.email,
              true,
              payload.role,
              payload.profileUrl,
              payload.provider,
              payload.certificate
            )
          );
        } else if (result.status === 204) {
          return;
        }
      } catch (error) {
        if (error?.message === "Network Error") {
          console.error("server maintenance:", error);
          // setMaintenance(true);
          return;
        }
        await signOutProcess(setAuthDto);
        // await warnSignOut(setAuthDto, "로그인이 만료되었습니다.");
        return;
      } finally {
        // setIsLoading(false);
      }
    };

    checkUserdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return authDto;
};
