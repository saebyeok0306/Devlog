import { user_check_api } from "api/User";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { authAtom } from "recoil/authAtom";
import { signOut } from "./authenticate";

function ObserverUser({ children }) {
  const [authDto, setAuthDto] = useRecoilState(authAtom);
  useEffect(() => {
    console.log("ObserverUser 갱신됨.", authDto);
    const authenticateUser = () => {
      if (!authDto?.isLogin) return;
      console.log("사용자를 검증합니다.");
      user_check_api()
        .then((res) => {
          console.log("문제없음 ", res);
        })
        .catch((err) => {
          console.log("문제있음 ", err);
          signOut(
            setAuthDto,
            err?.response ? err.response.data.error : err.message
          );
        });
    };

    // 30분을 밀리초로 변환 (5분 * 60초 * 1000밀리초)
    const intervalTime = 5 * 60 * 1000;
    // const intervalTime = 5 * 1000;

    // 인터벌 설정
    const intervalId = setInterval(authenticateUser, intervalTime);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [authDto]);

  return <>{children}</>;
}

export default ObserverUser;
