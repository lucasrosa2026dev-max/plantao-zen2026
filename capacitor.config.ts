import "dotenv/config";
import type { CapacitorConfig } from "@capacitor/cli";

const appUrl = process.env.APP_URL;
if (!appUrl || new URL(appUrl).protocol !== "https:") {
  throw new Error("Defina APP_URL com o endereço HTTPS da sua hospedagem antes de sincronizar os aplicativos.");
}

const config: CapacitorConfig = {
  appId: "care.plantaozen.app",
  appName: "Plantão Zen",
  webDir: "dist/public",
  server: {
    url: appUrl,
    cleartext: false,
  },
  plugins: {
    PushNotifications: { presentationOptions: ["badge", "sound", "alert"] },
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "automatic",
  },
};

export default config;
