import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { WAKE_START_EVENT, WAKE_END_EVENT } from "../../lib/serverStatus";

export default function ServerWakeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onStart = () => setVisible(true);
    const onEnd = () => setVisible(false);
    window.addEventListener(WAKE_START_EVENT, onStart);
    window.addEventListener(WAKE_END_EVENT, onEnd);
    return () => {
      window.removeEventListener(WAKE_START_EVENT, onStart);
      window.removeEventListener(WAKE_END_EVENT, onEnd);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="wake-banner">
      <Loader2 className="wake-banner-icon h-4 w-4 animate-spin" />
      <div className="wake-banner-text">
        <p className="wake-banner-title">Waking up the server</p>
        <p className="wake-banner-subtitle">Free hosting naps after inactivity — this can take up to a minute.</p>
      </div>
    </div>
  );
}