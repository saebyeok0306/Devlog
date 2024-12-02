import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useRecoilState } from "recoil";
import { ga4Atom } from "@/recoil/ga4Atom";

const PRODCUTION = import.meta.env.REACT_APP_ENV === "prod";

function Initizalize() {
  const [initialized, setInitialized] = useRecoilState(ga4Atom);
  useEffect(() => {
    if (PRODCUTION && !initialized) {
      ReactGA.initialize(import.meta.env.REACT_APP_GOOGLE_GTAG_ID);
      setInitialized(true);
    }
    // eslint-disable-next-line
  }, []);
}

function sendPageView(url, title, initialized) {
  if (PRODCUTION && initialized) {
    ReactGA.send({ hitType: "pageview", page: url, title: title });
  }
}

export { Initizalize, sendPageView };
