import { useEffect, useRef, useState } from "react";
import Markdown from "./Markdown";

/**
 * Renders markdown text with an optional typewriter reveal effect.
 * When `animate` is false, the full text renders immediately (used for
 * messages loaded from history, so re-opening a chat doesn't replay).
 */
const TypingMarkdown = ({ text = "", animate = false, speed = 12, onDone }) => {
  const [visibleChars, setVisibleChars] = useState(animate ? 0 : text.length);
  const firedDone = useRef(false);

  useEffect(() => {
    if (!animate) {
      setVisibleChars(text.length);
      return undefined;
    }

    setVisibleChars(0);
    firedDone.current = false;

    let current = 0;
    // Scale the chunk size to the message length so long answers
    // still finish typing in a reasonable, bounded amount of time.
    const chunk = Math.max(1, Math.round(text.length / 140));

    const interval = setInterval(() => {
      current += chunk;

      if (current >= text.length) {
        setVisibleChars(text.length);
        clearInterval(interval);
        if (!firedDone.current) {
          firedDone.current = true;
          onDone?.();
        }
        return;
      }

      setVisibleChars(current);
    }, speed);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, animate]);

  return <Markdown>{text.slice(0, visibleChars)}</Markdown>;
};

export default TypingMarkdown;
