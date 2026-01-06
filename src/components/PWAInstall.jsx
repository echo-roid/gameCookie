import { useEffect, useRef } from 'react';

export default function PWAInstall() {
  const deferredPrompt = useRef(null);
  const isAndroid = /android/i.test(navigator.userAgent);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
      console.log('✅ beforeinstallprompt available');
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () =>
      window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt.current) {
      // 🔥 Native popup (Gamezop style)
      deferredPrompt.current.prompt();
      await deferredPrompt.current.userChoice;
      deferredPrompt.current = null;
    } else {
      // ✅ Correct fallback
      alert(
        'To install the app:\n\n1. Tap Chrome menu (⋮)\n2. Tap "Install app"'
      );
    }
  };

  if (!isAndroid) return null;

  return (
    <i class="fa fa-download" aria-hidden="true" onClick={handleInstall}></i>
  );
}
