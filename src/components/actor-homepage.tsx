"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";

import type {
  ExternalLink,
  Locale,
  LocalizedText,
  PhotoItem,
  SectionId,
  SiteContent,
  VideoItem,
} from "@/content/siteContent";
import { getVideoEmbedUrl, pickFeaturedVideo } from "@/lib/video";

const STORAGE_KEY = "actor-homepage-locale";
const STORAGE_EVENT = "actor-homepage-locale-change";

const linkTone: Record<ExternalLink["type"], string> = {
  email: "bg-[rgba(140,94,69,0.12)] text-[var(--accent-strong)]",
  agent: "bg-[rgba(77,53,39,0.12)] text-[var(--accent-strong)]",
  imdb: "bg-[rgba(109,88,54,0.12)] text-[var(--accent-strong)]",
  spotlight: "bg-[rgba(150,116,76,0.14)] text-[var(--accent-strong)]",
  instagram: "bg-[rgba(168,117,94,0.12)] text-[var(--accent-strong)]",
  website: "bg-[rgba(89,78,66,0.12)] text-[var(--accent-strong)]",
};

const photoAspect: Record<NonNullable<PhotoItem["orientation"]>, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[6/4]",
  square: "aspect-square",
};

interface ActorHomepageProps {
  content: SiteContent;
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "sv" ? stored : "en";
}

function subscribeToLocale(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

function setStoredLocale(locale: Locale) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, locale);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function ActorHomepage({ content }: ActorHomepageProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const locale = useSyncExternalStore<Locale>(
    subscribeToLocale,
    getStoredLocale,
    () => "en",
  );

  const text = (value: LocalizedText) => value[locale];
  const aboutParagraphs = content.about.paragraphs[locale].filter(Boolean);
  const cvFiles = content.cv.files.filter(
    (asset) => asset.locale === locale || asset.locale === "shared",
  );
  const featuredVideo = pickFeaturedVideo(content.videos.items);
  const featuredVideoEmbed = featuredVideo ? getVideoEmbedUrl(featuredVideo) : null;
  const supportingVideos = featuredVideo
    ? content.videos.items.filter((item) => item !== featuredVideo)
    : content.videos.items;

  const hasSections: Record<SectionId, boolean> = {
    about: aboutParagraphs.length > 0,
    videos: Boolean(featuredVideo),
    portfolio: content.portfolio.items.length > 0,
    cv: content.cv.groups.length > 0 || cvFiles.length > 0,
    photos: content.photos.items.length > 0,
    links: content.links.items.length > 0,
  };

  const navSections = (Object.keys(content.ui.navigation) as SectionId[]).filter(
    (section) => hasSections[section],
  );

  const activePhoto =
    selectedPhotoIndex !== null ? content.photos.items[selectedPhotoIndex] : null;

  useEffect(() => {
    if (selectedPhotoIndex === null) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.setProperty("overflow", "hidden");

    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [selectedPhotoIndex]);

  useEffect(() => {
    if (selectedPhotoIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhotoIndex(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedPhotoIndex((current) =>
          current === null ? null : (current + 1) % content.photos.items.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedPhotoIndex((current) =>
          current === null
            ? null
            : (current - 1 + content.photos.items.length) % content.photos.items.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [content.photos.items.length, selectedPhotoIndex]);

  const changeLocale = (nextLocale: Locale) => {
    if (locale === nextLocale) {
      return;
    }

    startTransition(() => {
      setStoredLocale(nextLocale);
    });
  };

  const movePhoto = (direction: "next" | "previous") => {
    setSelectedPhotoIndex((current) => {
      if (current === null) {
        return 0;
      }

      if (direction === "next") {
        return (current + 1) % content.photos.items.length;
      }

      return (current - 1 + content.photos.items.length) % content.photos.items.length;
    });
  };

  return (
    <div className="relative isolate overflow-hidden pb-20">
      <div className="decor-orb pointer-events-none absolute left-[-8rem] top-28 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(188,144,106,0.28),_transparent_66%)] blur-2xl" />
      <div className="decor-orb pointer-events-none absolute right-[-4rem] top-[22rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(83,57,41,0.16),_transparent_70%)] blur-2xl [animation-delay:3s]" />

      <header className="sticky top-0 z-40 border-b border-white/50 bg-[rgba(247,241,232,0.72)] backdrop-blur-xl">
        <div className="section-shell flex items-center justify-between gap-4 py-4">
          <a href="#top" className="min-w-0">
            <p className="font-display text-xl tracking-[0.18em] text-[var(--accent-strong)] uppercase">
              {content.name}
            </p>
            <p className="truncate text-sm text-[var(--muted)]">{text(content.role)}</p>
          </a>

          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-5 text-sm text-[var(--muted)] lg:flex">
              {navSections.map((section) => (
                <a
                  key={section}
                  className="hover:text-[var(--accent-strong)]"
                  href={`#${section}`}
                >
                  {text(content.ui.navigation[section])}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/75 p-1 shadow-[0_12px_30px_rgba(28,20,14,0.08)]">
              <span className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                {text(content.ui.languageLabel)}
              </span>
              {(["en", "sv"] as const).map((option) => {
                const active = locale === option;

                return (
                  <button
                    key={option}
                    aria-pressed={active}
                    className={[
                      "rounded-full px-3 py-2 text-sm font-medium",
                      active
                        ? "bg-[var(--accent-strong)] text-white shadow-[0_8px_20px_rgba(29,19,14,0.18)]"
                        : "text-[var(--muted)] hover:bg-[rgba(140,94,69,0.12)]",
                    ].join(" ")}
                    disabled={isPending}
                    onClick={() => changeLocale(option)}
                    type="button"
                  >
                    {option === "en" ? "EN" : "SV"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="section-shell pt-8 sm:pt-10">
          <div className="glass-panel relative overflow-hidden px-6 py-8 sm:px-8 lg:px-12 lg:py-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_transparent_38%),linear-gradient(135deg,_rgba(255,255,255,0.16),_transparent_48%)]" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="fade-rise flex flex-col gap-7 [animation-delay:120ms]">
                <div className="flex flex-col gap-4">
                  <p className="section-kicker">{text(content.hero.eyebrow)}</p>
                  <h1 className="section-title max-w-4xl">
                    {text(content.hero.headline)}
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                    {text(content.hero.intro)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {hasSections.videos ? (
                    <a
                      className="rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,17,13,0.16)] hover:-translate-y-0.5 hover:bg-[var(--accent)]"
                      href="#videos"
                    >
                      {text(content.ui.watchReel)}
                    </a>
                  ) : null}

                  {cvFiles[0] ? (
                    <a
                      className="rounded-full border border-[rgba(90,52,35,0.16)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--accent-strong)] hover:-translate-y-0.5 hover:border-[rgba(90,52,35,0.3)]"
                      download
                      href={cvFiles[0].href}
                    >
                      {text(content.ui.downloadCv)}
                    </a>
                  ) : null}

                  {hasSections.links ? (
                    <a
                      className="rounded-full border border-transparent px-5 py-3 text-sm font-semibold text-[var(--muted)] hover:border-[rgba(90,52,35,0.16)] hover:bg-white/60 hover:text-[var(--accent-strong)]"
                      href="#links"
                    >
                      {text(content.ui.contact)}
                    </a>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {content.about.stats.map((stat) => (
                    <div
                      key={stat.value + stat.label.en}
                      className="rounded-[1.5rem] border border-white/65 bg-white/60 p-5 shadow-[0_20px_40px_rgba(24,16,11,0.06)]"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                        {text(stat.label)}
                      </p>
                      <p className="mt-3 font-display text-2xl text-[var(--accent-strong)]">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="fade-rise relative [animation-delay:240ms]">
                <div className="decor-orb pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle,_rgba(188,144,106,0.22),_transparent_68%)] blur-3xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[rgba(20,15,12,0.08)] shadow-[0_30px_80px_rgba(26,18,13,0.18)]">
                  <img
                    alt={text(content.hero.imageAlt)}
                    className="h-full min-h-[26rem] w-full object-cover"
                    src={content.hero.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,13,11,0.78)] via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
                      {content.name}
                    </p>
                    <p className="mt-2 max-w-md text-base leading-7 text-white/85">
                      {text(content.baseLocation)}
                    </p>
                    <p className="mt-3 text-sm text-white/70">
                      {text(content.hero.availability)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {hasSections.about ? (
          <section className="section-shell scroll-mt-28 py-20" id="about">
            <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="flex flex-col gap-5">
                <p className="section-kicker">{text(content.ui.navigation.about)}</p>
                <h2 className="section-title max-w-xl">{text(content.about.heading)}</h2>
                <p className="max-w-lg text-base leading-8 text-[var(--muted)]">
                  {text(content.about.intro)}
                </p>
              </div>

              <div className="glass-panel grid gap-6 px-6 py-6 sm:px-8 sm:py-8">
                {aboutParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-3xl text-lg leading-8 text-[var(--muted)]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {hasSections.videos ? (
          <section className="section-shell scroll-mt-28 py-4 sm:py-8" id="videos">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex flex-col gap-5">
                <p className="section-kicker">{text(content.ui.featuredReel)}</p>
                <h2 className="section-title max-w-2xl">{text(content.videos.heading)}</h2>
                <p className="max-w-lg text-base leading-8 text-[var(--muted)]">
                  {text(content.videos.intro)}
                </p>
              </div>

              <div className="glass-panel p-4 sm:p-5">
                {featuredVideo && featuredVideoEmbed ? (
                  <div className="grid gap-5">
                    <div className="overflow-hidden rounded-[1.6rem] bg-[rgba(17,12,9,0.92)] shadow-[0_24px_50px_rgba(23,16,11,0.22)]">
                      <div className="aspect-video">
                        <iframe
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-full w-full"
                          referrerPolicy="strict-origin-when-cross-origin"
                          src={featuredVideoEmbed}
                          title={text(featuredVideo.title)}
                        />
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                        {text(content.ui.featuredReel)}
                      </p>
                      <h3 className="mt-3 font-display text-3xl text-[var(--accent-strong)]">
                        {text(featuredVideo.title)}
                      </h3>
                      <p className="mt-4 text-base leading-8 text-[var(--muted)]">
                        {text(featuredVideo.summary)}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {supportingVideos.length > 0 ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {supportingVideos.map((video) => (
                  <VideoCard
                    key={video.url}
                    locale={locale}
                    video={video}
                    viewLabel={text(content.ui.watchReel)}
                  />
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {hasSections.portfolio ? (
          <section className="section-shell scroll-mt-28 py-20" id="portfolio">
            <div className="mb-10 flex flex-col gap-5 lg:max-w-3xl">
              <p className="section-kicker">{text(content.ui.selectedWork)}</p>
              <h2 className="section-title">{text(content.portfolio.heading)}</h2>
              <p className="text-base leading-8 text-[var(--muted)]">
                {text(content.portfolio.intro)}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {content.portfolio.items.map((item, index) => (
                <article
                  key={item.title.en}
                  className={[
                    "group relative overflow-hidden rounded-[2rem] border border-white/70 bg-[rgba(22,15,12,0.86)] shadow-[0_24px_65px_rgba(28,19,13,0.2)]",
                    index === 0 ? "md:col-span-2 md:row-span-2" : "",
                  ].join(" ")}
                >
                  <img
                    alt={text(item.title)}
                    className={[
                      "h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]",
                      index === 0 ? "min-h-[30rem]" : "min-h-[22rem]",
                    ].join(" ")}
                    src={item.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,10,8,0.92)] via-[rgba(14,10,8,0.16)] to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 text-white sm:p-8">
                    {item.tag ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                        {text(item.tag)}
                      </p>
                    ) : null}
                    <h3 className="font-display text-3xl sm:text-4xl">{text(item.title)}</h3>
                    <p className="max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                      {text(item.caption)}
                    </p>
                    {item.link ? (
                      <a
                        className="mt-2 inline-flex w-fit rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/12"
                        href={item.link}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {text(content.ui.viewPortfolioItem)}
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {hasSections.cv ? (
          <section className="section-shell scroll-mt-28 py-12" id="cv">
            <div className="glass-panel px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="flex flex-col gap-5">
                  <p className="section-kicker">{text(content.ui.navigation.cv)}</p>
                  <h2 className="section-title max-w-xl">{text(content.cv.heading)}</h2>
                  <p className="max-w-lg text-base leading-8 text-[var(--muted)]">
                    {text(content.cv.intro)}
                  </p>

                  {cvFiles.length > 0 ? (
                    <div className="mt-3 flex flex-col gap-3">
                      {cvFiles.map((file) => (
                        <a
                          key={file.href}
                          className="rounded-[1.4rem] border border-[rgba(90,52,35,0.14)] bg-white/75 px-5 py-4 text-sm font-semibold text-[var(--accent-strong)] shadow-[0_16px_30px_rgba(23,16,11,0.06)] hover:-translate-y-0.5 hover:border-[rgba(90,52,35,0.3)]"
                          download
                          href={file.href}
                        >
                          {text(file.label)}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {content.cv.groups.map((group) => (
                    <div
                      key={group.title.en}
                      className="rounded-[1.6rem] border border-white/70 bg-white/72 p-5 shadow-[0_20px_36px_rgba(24,17,12,0.07)]"
                    >
                      <h3 className="font-display text-2xl text-[var(--accent-strong)]">
                        {text(group.title)}
                      </h3>
                      <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
                        {group.items[locale].map((item) => (
                          <li
                            key={item}
                            className="border-t border-[rgba(91,67,50,0.08)] pt-3 first:border-t-0 first:pt-0"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {hasSections.photos ? (
          <section className="section-shell scroll-mt-28 py-20" id="photos">
            <div className="mb-10 flex flex-col gap-5 lg:max-w-3xl">
              <p className="section-kicker">{text(content.ui.photoMoments)}</p>
              <h2 className="section-title">{text(content.photos.heading)}</h2>
              <p className="text-base leading-8 text-[var(--muted)]">
                {text(content.photos.intro)}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {content.photos.items.map((photo, index) => (
                <button
                  key={photo.src}
                  aria-label={`${text(content.ui.openGallery)} ${index + 1}`}
                  className={[
                    "group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 shadow-[0_22px_55px_rgba(23,16,11,0.08)]",
                    photoAspect[photo.orientation ?? "portrait"],
                  ].join(" ")}
                  onClick={() => setSelectedPhotoIndex(index)}
                  type="button"
                >
                  <img
                    alt={text(photo.alt)}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    src={photo.src}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,12,9,0.65)] via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-5 text-left text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-medium text-white/85">{text(photo.alt)}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {hasSections.links ? (
          <section className="section-shell scroll-mt-28 py-12" id="links">
            <div className="glass-panel px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div className="mb-10 flex flex-col gap-5 lg:max-w-3xl">
                <p className="section-kicker">{text(content.ui.directLinks)}</p>
                <h2 className="section-title">{text(content.links.heading)}</h2>
                <p className="text-base leading-8 text-[var(--muted)]">
                  {text(content.links.intro)}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {content.links.items.map((link) => {
                  const opensExternally = link.url.startsWith("http");

                  return (
                    <a
                      key={link.label + link.url}
                      className="group rounded-[1.7rem] border border-white/70 bg-white/78 p-5 shadow-[0_20px_42px_rgba(24,17,12,0.07)] hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(24,17,12,0.11)]"
                      href={link.url}
                      rel={opensExternally ? "noreferrer" : undefined}
                      target={opensExternally ? "_blank" : undefined}
                    >
                      <span
                        className={[
                          "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                          linkTone[link.type],
                        ].join(" ")}
                      >
                        {link.label}
                      </span>
                      {link.note ? (
                        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                          {text(link.note)}
                        </p>
                      ) : (
                        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                          {link.url.replace(/^mailto:/, "")}
                        </p>
                      )}
                      <span className="mt-6 inline-flex text-sm font-semibold text-[var(--accent-strong)] group-hover:text-[var(--accent)]">
                        {text(content.ui.viewProfileLink)}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="section-shell pt-20 text-sm text-[var(--muted)]">
        <div className="border-t border-[rgba(91,67,50,0.14)] py-6">
          <p>
            {content.name} · {text(content.role)}
          </p>
        </div>
      </footer>

      {activePhoto ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(16,11,9,0.86)] p-4 backdrop-blur-md"
          role="dialog"
        >
          <button
            aria-label={text(content.ui.closeLightbox)}
            className="absolute right-5 top-5 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/18"
            onClick={() => setSelectedPhotoIndex(null)}
            type="button"
          >
            {text(content.ui.closeLightbox)}
          </button>

          <div className="relative flex w-full max-w-6xl items-center justify-center gap-3">
            <button
              aria-label={text(content.ui.previousPhoto)}
              className="hidden rounded-full border border-white/16 bg-white/10 p-3 text-white hover:bg-white/18 sm:inline-flex"
              onClick={() => movePhoto("previous")}
              type="button"
            >
              ←
            </button>

            <div className="glass-panel w-full max-w-4xl overflow-hidden border border-white/15 bg-[rgba(255,255,255,0.08)] p-3">
              <img
                alt={text(activePhoto.alt)}
                className="max-h-[78vh] w-full rounded-[1.4rem] object-cover"
                src={activePhoto.src}
              />
              <div className="px-3 pb-2 pt-4 text-white/82">
                <p className="text-base leading-7">{text(activePhoto.alt)}</p>
              </div>
            </div>

            <button
              aria-label={text(content.ui.nextPhoto)}
              className="hidden rounded-full border border-white/16 bg-white/10 p-3 text-white hover:bg-white/18 sm:inline-flex"
              onClick={() => movePhoto("next")}
              type="button"
            >
              →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function VideoCard({
  locale,
  video,
  viewLabel,
}: {
  locale: Locale;
  video: VideoItem;
  viewLabel: string;
}) {
  const summary = video.summary[locale];
  const title = video.title[locale];

  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/72 shadow-[0_20px_42px_rgba(24,17,12,0.07)]">
      {video.thumbnail ? (
        <div className="aspect-[16/10] overflow-hidden bg-[rgba(25,18,14,0.82)]">
          <img
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            src={video.thumbnail}
          />
        </div>
      ) : null}

      <div className="p-5">
        <h3 className="font-display text-2xl text-[var(--accent-strong)]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{summary}</p>
        <a
          className="mt-5 inline-flex rounded-full border border-[rgba(90,52,35,0.16)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)] hover:-translate-y-0.5 hover:border-[rgba(90,52,35,0.32)]"
          href={video.url}
          rel="noreferrer"
          target="_blank"
        >
          {viewLabel}
        </a>
      </div>
    </article>
  );
}
