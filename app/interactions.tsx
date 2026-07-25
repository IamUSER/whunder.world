"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type CampfirePost = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

const STORAGE_KEY = "whunderworld:campfire-notes:v1";
const MOTION_KEY = "whunderworld:motion:v1";
const MAX_POSTS = 8;

function readStoredPosts(): CampfirePost[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (post): post is CampfirePost =>
          typeof post?.id === "string" &&
          typeof post?.name === "string" &&
          typeof post?.message === "string" &&
          typeof post?.createdAt === "string",
      )
      .slice(0, MAX_POSTS);
  } catch {
    return [];
  }
}

function formatCampfireTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pinned earlier";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function CampfireNotes() {
  const [posts, setPosts] = useState<CampfirePost[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    setPosts(readStoredPosts());
    setReady(true);

    const syncPosts = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setPosts(readStoredPosts());
    };

    window.addEventListener("storage", syncPosts);
    return () => window.removeEventListener("storage", syncPosts);
  }, []);

  const persist = (nextPosts: CampfirePost[]) => {
    setPosts(nextPosts);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosts));
      setStorageAvailable(true);
      return true;
    } catch {
      setStorageAvailable(false);
      return false;
    }
  };

  const submitPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanMessage) {
      setError("Add your adventurer name and a note before pinning it.");
      setStatus("");
      return;
    }

    const nextPost: CampfirePost = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: cleanName,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
    };

    const saved = persist([nextPost, ...posts].slice(0, MAX_POSTS));
    setName("");
    setMessage("");
    setError("");
    setStatus(
      saved
        ? "Your note is pinned on this device."
        : "Your note is pinned for this visit. Browser storage is unavailable.",
    );
  };

  const clearPosts = () => {
    persist([]);
    setError("");
    setStatus("Campfire notes cleared from this device.");
  };

  return (
    <div className="campfire-board">
      <form className="campfire-form" onSubmit={submitPost} noValidate>
        <div className="field-group">
          <label htmlFor="campfire-name">Adventurer name</label>
          <input
            id="campfire-name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={24}
            autoComplete="nickname"
            placeholder="DryadFan"
          />
        </div>
        <div className="field-group">
          <label htmlFor="campfire-message">Quest note</label>
          <textarea
            id="campfire-message"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={160}
            rows={3}
            placeholder="Remember ropes for the next cavern run."
          />
          <span className="field-help">{message.length}/160 blocks placed</span>
        </div>
        {error ? (
          <p className="form-message form-error" role="alert">
            {error}
          </p>
        ) : null}
        {!storageAvailable ? (
          <p className="form-message">
            Storage is blocked, so these notes will disappear when this tab closes.
          </p>
        ) : null}
        <button className="pixel-button pixel-button-fire" type="submit">
          Pin note
        </button>
      </form>

      <div className="notes-list" aria-busy={!ready}>
        <div className="notes-list-heading">
          <h3>Notes on this device</h3>
          {posts.length > 0 ? (
            <button type="button" className="text-button" onClick={clearPosts}>
              Clear my notes
            </button>
          ) : null}
        </div>

        {!ready ? (
          <div className="notes-loading" role="status">
            <span />
            <span />
            Loading your campfire...
          </div>
        ) : posts.length === 0 ? (
          <p className="notes-empty">No notes are pinned on this device yet.</p>
        ) : (
          <ol>
            {posts.map((post) => (
              <li key={post.id}>
                <div>
                  <strong>{post.name}</strong>
                  <time dateTime={post.createdAt}>{formatCampfireTime(post.createdAt)}</time>
                </div>
                <p>{post.message}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

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
    setReduced(shouldReduce);
    document.documentElement.dataset.motion = shouldReduce ? "reduced" : "full";
    window.dispatchEvent(
      new CustomEvent("whunder:motion", { detail: { reduced: shouldReduce } }),
    );
    setReady(true);
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
