import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem("luxe-cookie-consent")) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (value: string) => {
    window.localStorage.setItem("luxe-cookie-consent", value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="glass-panel fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl p-5 shadow-lift md:flex md:items-center md:gap-6"
    >
      <p className="text-sm text-muted-foreground">
        We use cookies to improve your browsing experience and remember your selection. See our{" "}
        <a href="#privacy" className="text-gold underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>
      <div className="mt-4 flex shrink-0 gap-2 md:mt-0">
        <Button variant="outline" size="sm" onClick={() => decide("essential")}>
          Essential only
        </Button>
        <Button size="sm" onClick={() => decide("all")}>
          Accept all
        </Button>
      </div>
    </div>
  );
}
