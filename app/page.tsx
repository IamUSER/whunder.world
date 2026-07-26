import Link from "next/link";

import { MagicCursor, MotionControl } from "./interactions";

const announcements = [
  {
    date: "Jul 25",
    title: "The new spawn is taking shape",
    body: "News, build nights, and server notices now have a home at whunder.world.",
  },
  {
    date: "Vault",
    title: "The archive shelves are ready",
    body: "Previous worlds can become direct ZIP downloads as soon as the map files are supplied.",
  },
];

const vaultItems = [
  {
    name: "Founders' World",
    era: "2012 archive",
    detail: "The first world belongs here. Its original map file has not been supplied yet.",
    state: "Awaiting map file",
  },
  {
    name: "Community Showcase",
    era: "Build archive",
    detail: "A future home for towns, arenas, pixel art, and favorite player-made landmarks.",
    state: "Shelf ready",
  },
];

const logoLetters = "WHUNDERWORLD".split("");

function PixelTree({ className }: { className: string }) {
  return (
    <div className={`pixel-tree ${className}`} aria-hidden="true">
      <span className="tree-crown crown-one" />
      <span className="tree-crown crown-two" />
      <span className="tree-crown crown-three" />
      <span className="tree-trunk" />
    </div>
  );
}

function GemArc() {
  return (
    <div className="gem-arc" aria-hidden="true">
      <span className="gem gem-ruby" />
      <span className="gem gem-amber" />
      <span className="gem gem-topaz" />
      <span className="gem gem-emerald" />
      <span className="gem gem-sapphire" />
      <span className="gem gem-amethyst" />
      <span className="gem gem-rose" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Link className="skip-link" href="#main-content" prefetch={false}>
        Skip to the adventure
      </Link>
      <MagicCursor />

      <header className="site-header">
        <Link
          className="mini-mark"
          href="#home"
          prefetch={false}
          aria-label="WhunderWorld home"
        >
          <span aria-hidden="true">W</span>
          <strong>whunder.world</strong>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="#news" prefetch={false}>News</Link>
          <Link href="#campfire" prefetch={false}>Campfire</Link>
          <Link href="#vault" prefetch={false}>World Vault</Link>
          <Link href="#story" prefetch={false}>Our Story</Link>
        </nav>
        <MotionControl />
      </header>

      <main id="main-content">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="sky-decor" aria-hidden="true">
            <span className="pixel-star star-one" />
            <span className="pixel-star star-two" />
            <span className="pixel-star star-three" />
            <span className="cloud cloud-one" />
            <span className="cloud cloud-two" />
            <span className="mountain mountain-back" />
            <span className="mountain mountain-front" />
            <PixelTree className="tree-left-back" />
            <PixelTree className="tree-left-front" />
            <PixelTree className="tree-right-back" />
            <PixelTree className="tree-right-front" />
            <div className="floating-island island-left">
              <span />
            </div>
            <div className="floating-island island-right">
              <span />
            </div>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">A Terraria fan server since 2012</p>
            <div className="wordmark-wrap">
              <GemArc />
              <h1 className="wordmark" id="hero-title" aria-label="WhunderWorld">
                {logoLetters.map((letter, index) => (
                  <span key={`${letter}-${index}`}>{letter}</span>
                ))}
              </h1>
            </div>
            <p className="hero-subtitle">
              A storybook world for builders, explorers, and boss hunters.
            </p>
            <div className="hero-actions">
              <Link
                className="pixel-button pixel-button-primary"
                href="#news"
                prefetch={false}
              >
                Latest news
              </Link>
              <Link
                className="pixel-button pixel-button-secondary"
                href="#vault"
                prefetch={false}
              >
                Open the vault
              </Link>
            </div>
          </div>

          <div className="ground-layer" aria-hidden="true">
            <div className="grass-fringe">
              {Array.from({ length: 28 }, (_, index) => (
                <span key={index} />
              ))}
            </div>
            <span className="flower flower-pink" />
            <span className="flower flower-yellow" />
            <span className="flower flower-blue" />
            <span className="mushroom mushroom-left" />
            <span className="mushroom mushroom-right" />
          </div>
        </section>

        <section className="news-section section-shell" id="news" aria-labelledby="news-title">
          <div className="section-heading">
            <h2 id="news-title">From the Guide&apos;s Desk</h2>
            <p>News, map updates, and strange noises from below spawn.</p>
          </div>
          <div className="announcement-board">
            {announcements.map((announcement, index) => (
              <article className={`announcement note-${index + 1}`} key={announcement.title}>
                <time>{announcement.date}</time>
                <h3>{announcement.title}</h3>
                <p>{announcement.body}</p>
              </article>
            ))}
            <div className="guide-sprite" aria-hidden="true">
              <span className="guide-hat" />
              <span className="guide-head" />
              <span className="guide-body" />
            </div>
          </div>
        </section>

        <section className="campfire-section" id="campfire" aria-labelledby="campfire-title">
          <div className="campfire-scene" aria-hidden="true">
            <div className="moon" />
            <PixelTree className="camp-tree-one" />
            <PixelTree className="camp-tree-two" />
            <div className="pixel-fire">
              <span className="flame flame-gold" />
              <span className="flame flame-orange" />
              <span className="flame flame-cream" />
              <span className="log log-one" />
              <span className="log log-two" />
            </div>
          </div>
          <div className="campfire-copy">
            <h2 id="campfire-title">Campfire Notes</h2>
            <p>
              A shared message board for greetings, build ideas, and server notices is taking
              shape.
            </p>
          </div>
          <article
            className="campfire-board campfire-coming-soon"
            aria-labelledby="campfire-coming-title"
          >
            <div className="coming-soon-spark" aria-hidden="true">
              <span className="spark-gem" />
              <span className="spark-note">
                <i />
                <i />
                <i />
              </span>
              <span className="spark-star spark-star-one" />
              <span className="spark-star spark-star-two" />
              <span className="spark-star spark-star-three" />
            </div>
            <div className="coming-soon-copy">
              <p className="coming-soon-badge">Coming soon</p>
              <h3 id="campfire-coming-title">The message board is being crafted</h3>
              <p>
                Soon, adventurers will have a shared place for greetings, quest plans, and build
                ideas.
              </p>
            </div>
          </article>
        </section>

        <section className="vault-section section-shell" id="vault" aria-labelledby="vault-title">
          <div className="section-heading vault-heading">
            <h2 id="vault-title">The World Vault</h2>
            <p>Old worlds never vanish. They become legends.</p>
          </div>
          <div className="vault-grid">
            <article className="vault-feature">
              <div className="vault-door" aria-hidden="true">
                <span className="vault-gem" />
                <span className="vault-keyhole" />
              </div>
              <div>
                <p className="vault-kicker">Archive index</p>
                <h3>Map shelf manifest</h3>
                <p>
                  A ready-made place for version notes, world sizes, checksums, and downloadable
                  map ZIPs.
                </p>
                <a className="pixel-button pixel-button-primary" href="downloads/archive-manifest.txt" download>
                  Download manifest
                </a>
              </div>
            </article>

            <div className="vault-shelves">
              {vaultItems.map((item) => (
                <article className="vault-item" key={item.name}>
                  <div>
                    <span className="vault-era">{item.era}</span>
                    <h3>{item.name}</h3>
                    <p>{item.detail}</p>
                  </div>
                  <span className="vault-state" aria-label={`${item.name}: ${item.state}`}>
                    {item.state}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="story-section" id="story" aria-labelledby="story-title">
          <div className="story-copy">
            <p className="story-year">2012</p>
            <h2 id="story-title">Built block by block</h2>
            <p>
              What began as a small world became a long-running home for builders, explorers,
              collectors, and friends.
            </p>
          </div>
          <div className="story-strata" aria-hidden="true">
            <span className="ore ore-ruby" />
            <span className="ore ore-gold" />
            <span className="ore ore-blue" />
            <span className="crystal crystal-one" />
            <span className="crystal crystal-two" />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>WhunderWorld</strong>
          <span>whunder.world</span>
        </div>
        <p>Fan made with heart, pixels, and an unreasonable amount of dirt.</p>
        <small>
          WhunderWorld is a community fan server. It is not affiliated with or endorsed by
          Re-Logic.
        </small>
      </footer>
    </>
  );
}
