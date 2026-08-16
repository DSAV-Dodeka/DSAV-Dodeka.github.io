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
 * import in `src/pages/layout.tsx`, then delete this file, HeroVideo.scss and
 * the clips in `public/hero/`. Nothing else needs changing: `--hero-offset`
 * defaults to 0px in animation.css, and the hero offset in `home.tsx` measures
 * the element and falls back to 0 when it is absent.
 */
import { useEffect } from "react";
import "./HeroVideo.scss";
import logo from "$images/logo.png";

// The clip is served from our own origin (GitHub Pages), not Cloudinary.
//
// It used to be delivered straight from Cloudinary with an on-the-fly
// `f_auto,q_auto,w_1920,c_limit` transformation. That derivation is cheap — it
// happens once and is cached — but the *delivery* is not: the hero autoplays
// and loops on the busiest page of the site, and a looping <video> re-fetches
// on browsers that keep media out of the HTTP disk cache (iOS Safari). One
// month of that came to 37.79 GB, far past the free plan's 25 GB.
//
// Serving static files from Pages costs nothing, so the files below are the
// Cloudinary output downloaded once and committed:
//   q_auto:eco   quality tuned for a background clip behind a scrim
//   c_limit      cap the width, never upscale
//   ac_none      drop the audio track — the hero is muted anyway
const HERO_VIDEO_DESKTOP = "/hero/owee_teaser_1280.mp4"; // 2.4 MB
const HERO_VIDEO_MOBILE = "/hero/owee_teaser_720.mp4"; //  1.0 MB

// The first frame as a still (63 KB). It paints straight away and covers the
// gap while the video buffers, so the hero never shows a black box.
const HERO_POSTER_URL = "/hero/owee_teaser_poster.jpg";

// `<source media="…">` is not a reliable way to pick a video file — browsers
// only evaluate it at load time and Chrome dropped it entirely — so the choice
// is made here and assigned to `.src` in an effect. The element is rendered
// without a `src` so the prerendered HTML fetches nothing on its own: the
// poster carries the first paint and exactly one video file is ever requested.
function pickHeroVideo() {
  return window.matchMedia("(max-width: 768px)").matches
    ? HERO_VIDEO_MOBILE
    : HERO_VIDEO_DESKTOP;
}

function HeroVideo() {
  useEffect(() => {
    const video = document.getElementById(
      "hero_video_element",
    ) as HTMLVideoElement | null;

    if (video && !video.src) {
      video.src = pickHeroVideo();
    }
  }, []);

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
        poster={HERO_POSTER_URL}
        preload="auto"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="hero_scrim" />
      <div className="hero_content">
        <img className="hero_logo" src={logo} alt="Dodeka" />
        <h1 className="hero_title">
          Dé Delftse Studenten Atletiek Vereniging
        </h1>
      </div>
      <div className="hero_scroll_indicator">
        <div className="hero_scroll_chevron" />
      </div>
    </div>
  );
}

export default HeroVideo;
