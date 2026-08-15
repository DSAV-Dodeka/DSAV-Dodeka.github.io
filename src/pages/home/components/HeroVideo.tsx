/**
 * Fullscreen hero video, rendered above the navigation bar on the home page.
 *
 * The navigation bar is `position: sticky; top: 0`, so it simply starts below
 * the fold and slides into place once the video has been scrolled past — no
 * scroll logic needed for that.
 *
 * The one thing that does need help is `#home_logo` (the big shrinking logo in
 * the navbar), which is `position: fixed` and would otherwise float on top of
 * the video. This component publishes `--hero-offset` — the amount of hero
 * still above the fold — and animation.css adds it to the logo's `top`, so the
 * logo rides along with the navbar.
 *
 * TO REMOVE THE HERO: delete the `{isHome && <HeroVideo />}` line and its
 * import in `src/pages/layout.tsx`, then delete this file and HeroVideo.scss.
 * Nothing else needs changing: `--hero-offset` defaults to 0px in
 * animation.css, and the hero offset in `home.tsx` measures the element and
 * falls back to 0 when it is absent.
 */
import { useEffect } from "react";
import "./HeroVideo.scss";

const HERO_VIDEO_URL =
  "https://res.cloudinary.com/dknah0nov/video/upload/v1786804828/Dodeka_OWee_2026_teaser.mp4";

function HeroVideo() {
  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      const hero = document.getElementById("hero_video_wrapper");
      const remaining = hero
        ? Math.max(hero.offsetHeight - window.scrollY, 0)
        : 0;
      root.style.setProperty("--hero-offset", `${remaining}px`);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // The first measurement can happen before layout has settled, which would
    // leave --hero-offset at 0 and drop the logo onto the video.
    const hero = document.getElementById("hero_video_wrapper");
    const observer = hero ? new ResizeObserver(update) : null;
    observer?.observe(hero!);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
      root.style.removeProperty("--hero-offset");
    };
  }, []);

  return (
    <div id="hero_video_wrapper">
      <video
        id="hero_video_element"
        src={HERO_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="hero_scroll_indicator">
        <div className="hero_scroll_chevron" />
      </div>
    </div>
  );
}

export default HeroVideo;
