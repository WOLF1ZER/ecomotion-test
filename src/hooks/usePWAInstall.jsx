import { useEffect, useState } from "react";

const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = () => {
    // Detect iOS Safari and show install instructions
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

    // Detect the user's language (default to English)
    const userLang = navigator.language.startsWith("ru") ? "ru" : "en";

    if (isIOS && !isInStandaloneMode) {
      const messages = {
        en: 
          "To install this app on iOS:\n\n" +
          "1️⃣ Tap the **Share** button (🔗) in Safari.\n" +
          "2️⃣ Scroll down and tap **Add to Home Screen** (➕🏠).\n" +
          "3️⃣ Confirm by tapping **Add**.\n\n" +
          "The app will now appear on your home screen!",
        
        ru: 
          "Чтобы установить это приложение на iOS:\n\n" +
          "1️⃣ Нажмите кнопку **Поделиться** (🔗) в Safari.\n" +
          "2️⃣ Прокрутите вниз и выберите **Добавить на экран «Домой»** (➕🏠).\n" +
          "3️⃣ Подтвердите, нажав **Добавить**.\n\n" +
          "Приложение появится на вашем домашнем экране!"
      };

      alert(messages[userLang]);
      return;
    }

    // Show install prompt on PC (desktop) and Android
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the PWA install.");
        } else {
          console.log("User dismissed the PWA install.");
        }
        setDeferredPrompt(null); // Reset after use
      });
    } else {
      alert(userLang === "ru" 
        ? "Установка недоступна. Попробуйте обновить страницу или использовать другой браузер." 
        : "Installation is not available. Try refreshing the page or using a different browser."
      );
    }
  };

  return installPWA;
};

export default usePWAInstall;
