import { useEffect, useState } from "react";

export function TypewriterHeading({ text }: { text: string }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleText(text);
      return;
    }

    let index = 0;
    setVisibleText("");
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index === text.length) window.clearInterval(timer);
    }, 85);

    return () => window.clearInterval(timer);
  }, [text]);

  return (
    <h1 className="typewriter-heading" aria-label={text}>
      <span aria-hidden="true">{visibleText}</span>
      <i aria-hidden="true" />
    </h1>
  );
}
