"use client";

import { useEffect, useRef, useState } from "react";

const MOTION_KEY = "whunderworld:motion:v1";

export function MotionControl() {
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(MOTION_KEY);
    } catch {
      stored = null;
    }

    const shouldReduce = stored === "reduced" || (stored === null && media.matches);
    document.documentElement.dataset.motion = shouldReduce ? "reduced" : "full";
    window.dispatchEvent(
      new CustomEvent("whunder:motion", { detail: { reduced: shouldReduce } }),
    );

    const frame = window.requestAnimationFrame(() => {
      setReduced(shouldReduce);
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleMotion = () => {
    const nextReduced = !reduced;
    setReduced(nextReduced);
    document.documentElement.dataset.motion = nextReduced ? "reduced" : "full";
    try {
      window.localStorage.setItem(MOTION_KEY, nextReduced ? "reduced" : "full");
    } catch {
      // The visual preference still works for this visit.
    }
    window.dispatchEvent(
      new CustomEvent("whunder:motion", { detail: { reduced: nextReduced } }),
    );
  };

  return (
    <button
      className="motion-toggle"
      type="button"
      aria-pressed={reduced}
      onClick={toggleMotion}
      title="Toggle decorative animation"
    >
      <span aria-hidden="true">{reduced ? "◇" : "✦"}</span>
      {ready && reduced ? "Motion off" : "Motion on"}
    </button>
  );
}

export function MagicCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const systemReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let particleIndex = 0;
    let lastParticleAt = 0;
    let frame = 0;
    let pointerX = -100;
    let pointerY = -100;
    let manuallyReduced = document.documentElement.dataset.motion === "reduced";

    const isEnabled = () => finePointer.matches && !systemReduce.matches && !manuallyReduced;

    const syncCursorMode = () => {
      document.documentElement.classList.toggle("cursor-enhanced", isEnabled());
      if (!isEnabled() && cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    const drawCursor = () => {
      frame = 0;
      if (!cursorRef.current || !isEnabled()) return;
      cursorRef.current.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    };

    const moveCursor = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(drawCursor);

      const target = event.target as HTMLElement | null;
      const overTextField = Boolean(target?.closest("input, textarea, select"));
      if (cursorRef.current) cursorRef.current.style.opacity = overTextField ? "0" : "1";
      if (!isEnabled() || overTextField || event.timeStamp - lastParticleAt < 42) return;

      lastParticleAt = event.timeStamp;
      const particle = particleRefs.current[particleIndex % particleRefs.current.length];
      particleIndex += 1;
      if (!particle) return;

      particle.style.left = `${event.clientX}px`;
      particle.style.top = `${event.clientY}px`;
      particle.getAnimations().forEach((animation) => animation.cancel());
      particle.animate(
        [
          { opacity: 0.95, transform: "translate3d(-2px, -2px, 0) scale(1)" },
          {
            opacity: 0,
            transform: `translate3d(${(particleIndex % 3) * 7 - 8}px, 18px, 0) scale(0.25)`,
          },
        ],
        { duration: 620, easing: "steps(6, end)" },
      );
    };

    const hideCursor = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    const handleManualMotion = (event: Event) => {
      manuallyReduced = Boolean((event as CustomEvent).detail?.reduced);
      syncCursorMode();
    };

    finePointer.addEventListener("change", syncCursorMode);
    systemReduce.addEventListener("change", syncCursorMode);
    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("pointerleave", hideCursor);
    window.addEventListener("whunder:motion", handleManualMotion);
    syncCursorMode();

    return () => {
      finePointer.removeEventListener("change", syncCursorMode);
      systemReduce.removeEventListener("change", syncCursorMode);
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerleave", hideCursor);
      window.removeEventListener("whunder:motion", handleManualMotion);
      document.documentElement.classList.remove("cursor-enhanced");
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="cursor-layer" aria-hidden="true">
      <div className="catblade-cursor" ref={cursorRef}>
        <span className="catblade" />
      </div>
      {Array.from({ length: 12 }, (_, index) => (
        <span
          className={`cursor-particle particle-${(index % 6) + 1}`}
          key={index}
          ref={(element) => {
            particleRefs.current[index] = element;
          }}
        />
      ))}
    </div>
  );
}
