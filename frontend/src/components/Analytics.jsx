import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize(import.meta.env.VITE_GTAG); // your Measurement ID
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};