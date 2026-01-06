
import { useEffect, useRef, useState } from 'react';

export default function PWAInstall() {
  const deferredPrompt = useRef(null);
  const [platform, setPlatform] = useState('other');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    if (/android/.test(ua)) setPlatform('android');
    if (/iphone|ipad|ipod/.test(ua)) setPlatform('ios');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
    });
  }, []);

  const handleClick = async () => {
    // 🤖 ANDROID: Native install
    if (platform === 'android' && deferredPrompt.current) {
      deferredPrompt.current.prompt();
      await deferredPrompt.current.userChoice;
      deferredPrompt.current = null;
      return;
    }

    // 🍎 iOS: Instruction
    if (platform === 'ios') {
      alert('Tap Share → Add to Home Screen');
      return;
    }

    // 💻 Desktop fallback
    alert('Use browser menu → Install App');
  };

  return (
    <i class="fa fa-download" onClick={handleClick} aria-hidden="true"></i>
  );
}

