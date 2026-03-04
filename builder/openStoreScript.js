const APP_STORE_URL = "https://apps.apple.com/ua/app/cleaner-guru-%D0%BA%D0%BB%D1%96%D0%BD%D0%B5%D1%80/id1476380919?l=uk";

const applovinCallback = () => {
  window.mraid ? window.mraid.open(APP_STORE_URL) : window.top.open(APP_STORE_URL);
};

export const version = () => {
  const buildVersion = "applovin";

  switch (buildVersion) {
    case "applovin":
      return applovinCallback;
    default:
      return applovinCallback;
  }
};
