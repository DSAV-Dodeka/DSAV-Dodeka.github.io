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
import logo from "$images/logo.png";

// Cloudinary serves the raw upload untouched unless the URL carries a
// transformation segment. The source file is 3840x2160, 75 MB for 15 seconds —
// an average of 41.7 Mbps, which no normal connection can stream in real time,
// so the hero sat frozen while it buffered.
//
// These transformations are applied on delivery and cached by Cloudinary, so
// the original upload does not need re-encoding or replacing:
//   f_auto          best format per browser (WebM/VP9 to Chrome, MP4 to Safari)
//   q_auto          quality chosen per frame content
//   w_1920,c_limit  cap the width at 1920, never upscale
const CLOUDINARY_BASE = "https://res.cloudinary.com/dknah0nov/video/upload";
const HERO_VIDEO_ID = "v1786804828/Dodeka_OWee_2026_teaser";

// 5.2 MB at 2.9 Mbps, down from 75 MB at 41.7 Mbps.
const HERO_VIDEO_URL = `${CLOUDINARY_BASE}/f_auto,q_auto,w_1920,c_limit/${HERO_VIDEO_ID}.mp4`;

// The first frame as a still (~63 KB, `so_0` = start offset 0). It paints
// straight away and covers the gap while the video buffers, so the hero never
// shows a black box.
const HERO_POSTER_URL = `${CLOUDINARY_BASE}/so_0,f_auto,q_auto,w_1920,c_limit/${HERO_VIDEO_ID}.jpg`;

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
