export type Locale = "en" | "sv";
export type AssetLocale = Locale | "shared";
export type SectionId = "about" | "videos" | "portfolio" | "cv" | "photos" | "links";
export type VideoProvider = "youtube" | "vimeo";
export type PhotoOrientation = "portrait" | "landscape" | "square";
export type ExternalLinkType =
  | "email"
  | "agent"
  | "imdb"
  | "spotlight"
  | "instagram"
  | "website";

export type LocalizedText = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export interface CvAsset {
  locale: AssetLocale;
  label: LocalizedText;
  href: string;
}

export interface CvGroup {
  title: LocalizedText;
  items: LocalizedList;
}

export interface VideoItem {
  provider: VideoProvider;
  url: string;
  title: LocalizedText;
  summary: LocalizedText;
  featured?: boolean;
  thumbnail?: string;
}

export interface PortfolioItem {
  title: LocalizedText;
  caption: LocalizedText;
  image: string;
  link?: string;
  tag?: LocalizedText;
}

export interface PhotoItem {
  src: string;
  alt: LocalizedText;
  orientation?: PhotoOrientation;
}

export interface ExternalLink {
  label: string;
  url: string;
  type: ExternalLinkType;
  note?: LocalizedText;
}

export interface SiteContent {
  name: string;
  role: LocalizedText;
  baseLocation: LocalizedText;
  hero: {
    eyebrow: LocalizedText;
    headline: LocalizedText;
    intro: LocalizedText;
    availability: LocalizedText;
    image: string;
    imageAlt: LocalizedText;
  };
  ui: {
    languageLabel: LocalizedText;
    navigation: Record<SectionId, LocalizedText>;
    watchReel: LocalizedText;
    downloadCv: LocalizedText;
    contact: LocalizedText;
    openGallery: LocalizedText;
    viewPortfolioItem: LocalizedText;
    viewProfileLink: LocalizedText;
    featuredReel: LocalizedText;
    moreClips: LocalizedText;
    selectedWork: LocalizedText;
    photoMoments: LocalizedText;
    directLinks: LocalizedText;
    closeLightbox: LocalizedText;
    previousPhoto: LocalizedText;
    nextPhoto: LocalizedText;
  };
  about: {
    heading: LocalizedText;
    intro: LocalizedText;
    paragraphs: LocalizedList;
    stats: Array<{
      label: LocalizedText;
      value: string;
    }>;
  };
  videos: {
    heading: LocalizedText;
    intro: LocalizedText;
    items: VideoItem[];
  };
  portfolio: {
    heading: LocalizedText;
    intro: LocalizedText;
    items: PortfolioItem[];
  };
  cv: {
    heading: LocalizedText;
    intro: LocalizedText;
    files: CvAsset[];
    groups: CvGroup[];
  };
  photos: {
    heading: LocalizedText;
    intro: LocalizedText;
    items: PhotoItem[];
  };
  links: {
    heading: LocalizedText;
    intro: LocalizedText;
    items: ExternalLink[];
  };
}

export const siteContent: SiteContent = {
  name: "Alex Arden",
  role: {
    en: "Actor for screen, stage, and voice",
    sv: "Skadespelare for film, scen och voice",
  },
  baseLocation: {
    en: "Based in Stockholm and available across Europe",
    sv: "Bas i Stockholm och tillganglig i hela Europa",
  },
  hero: {
    eyebrow: {
      en: "Stockholm / London / International work",
      sv: "Stockholm / London / Internationella projekt",
    },
    headline: {
      en: "Grounded performances with cinematic intensity and quiet magnetism.",
      sv: "Forankrade roller med filmisk intensitet och stilla dragningskraft.",
    },
    intro: {
      en: "Use this homepage as your polished casting-facing profile: feature your reel, selected credits, downloadable CV, stills, and the links that matter most.",
      sv: "Anvand den har hemsidan som din eleganta profil for casting: visa reel, utvalda credits, nedladdningsbart CV, stillbilder och de lankar som betyder mest.",
    },
    availability: {
      en: "Currently available for feature, premium television, and theatre projects.",
      sv: "Tillganglig for langfilm, premiumserier och scenproduktioner.",
    },
    image: "/images/hero-portrait.svg",
    imageAlt: {
      en: "Editorial portrait placeholder for the lead actor",
      sv: "Portrattplaceholder i editorial stil for skadespelaren",
    },
  },
  ui: {
    languageLabel: {
      en: "Language",
      sv: "Sprak",
    },
    navigation: {
      about: {
        en: "About",
        sv: "Om",
      },
      videos: {
        en: "Reels",
        sv: "Reels",
      },
      portfolio: {
        en: "Portfolio",
        sv: "Portfolio",
      },
      cv: {
        en: "CV",
        sv: "CV",
      },
      photos: {
        en: "Photos",
        sv: "Bilder",
      },
      links: {
        en: "Links",
        sv: "Lankar",
      },
    },
    watchReel: {
      en: "Watch reel",
      sv: "Se reel",
    },
    downloadCv: {
      en: "Download CV",
      sv: "Ladda ned CV",
    },
    contact: {
      en: "Contact links",
      sv: "Kontaktlankar",
    },
    openGallery: {
      en: "Open gallery image",
      sv: "Oppna bild",
    },
    viewPortfolioItem: {
      en: "View project",
      sv: "Visa projekt",
    },
    viewProfileLink: {
      en: "Open link",
      sv: "Oppna lank",
    },
    featuredReel: {
      en: "Featured reel",
      sv: "Utvald reel",
    },
    moreClips: {
      en: "More clips",
      sv: "Fler klipp",
    },
    selectedWork: {
      en: "Selected work",
      sv: "Utvalda arbeten",
    },
    photoMoments: {
      en: "Photo gallery",
      sv: "Fotogalleri",
    },
    directLinks: {
      en: "Professional links",
      sv: "Professionella lankar",
    },
    closeLightbox: {
      en: "Close",
      sv: "Stang",
    },
    previousPhoto: {
      en: "Previous photo",
      sv: "Forra bild",
    },
    nextPhoto: {
      en: "Next photo",
      sv: "Nasta bild",
    },
  },
  about: {
    heading: {
      en: "An actor homepage designed to feel premium, confident, and castable.",
      sv: "En skadespelarsajt som kanns premium, sjalvsaker och castbar.",
    },
    intro: {
      en: "Swap the sample copy below with your own biography, current playing age, skills, and representation details.",
      sv: "Byt ut exempeltexten nedan mot din egen biografi, spelalder, kompetenser och representation.",
    },
    paragraphs: {
      en: [
        "Alex Arden is an actor with a background in film, television, and contemporary theatre. The work sits between precision and vulnerability, with a presence that reads equally well in intimate close-up and on a large stage.",
        "This template is structured for real casting use: it keeps the experience clean, image-led, and easy to update whenever you add a new credit, gallery image, festival screening, or profile link.",
      ],
      sv: [
        "Alex Arden ar en skadespelare med bakgrund inom film, tv och samtida teater. Arbetet ror sig mellan precision och sarbarhet, med en narvaro som fungerar lika starkt i nara bild som pa stor scen.",
        "Mallen ar byggd for faktisk castinganvandning: upplevelsen ar ren, bilddriven och enkel att uppdatera nar du far nya credits, nya stillbilder, festivalvisningar eller profilankar.",
      ],
    },
    stats: [
      {
        label: {
          en: "Playing age",
          sv: "Spelalder",
        },
        value: "27-37",
      },
      {
        label: {
          en: "Languages",
          sv: "Sprak",
        },
        value: "EN / SV / ES",
      },
      {
        label: {
          en: "Base",
          sv: "Bas",
        },
        value: "Stockholm",
      },
    ],
  },
  videos: {
    heading: {
      en: "Keep your strongest reel front and center.",
      sv: "Lat din starkaste reel ligga i fokus.",
    },
    intro: {
      en: "Feature one primary reel on the page and support it with extra Vimeo or YouTube clips underneath.",
      sv: "Lyft fram en huvudreel pa sidan och komplettera med fler Vimeo- eller YouTube-klipp under.",
    },
    items: [
      {
        provider: "youtube",
        url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        featured: true,
        thumbnail: "/video-thumbs/featured-reel.svg",
        title: {
          en: "Main showreel",
          sv: "Huvudreel",
        },
        summary: {
          en: "Lead dramatic material with close-up scenes, natural dialogue, and a sharper cinematic tempo.",
          sv: "Ledande dramatiskt material med nara scener, naturlig dialog och ett mer filmiskt tempo.",
        },
      },
      {
        provider: "vimeo",
        url: "https://vimeo.com/76979871",
        thumbnail: "/video-thumbs/drama-scene.svg",
        title: {
          en: "Drama scene excerpt",
          sv: "Dramascen",
        },
        summary: {
          en: "A quieter dramatic sequence that highlights restraint, listening, and emotional detail.",
          sv: "En tystare dramatisk sekvens som visar aterhallning, lyssnande och emotionell precision.",
        },
      },
      {
        provider: "youtube",
        url: "https://youtu.be/ysz5S6PUM-U",
        thumbnail: "/video-thumbs/commercial-spot.svg",
        title: {
          en: "Commercial and movement edit",
          sv: "Reklam och rorelseklipp",
        },
        summary: {
          en: "A shorter edit for commercial tone, physicality, and camera presence.",
          sv: "En kortare edit for reklamton, fysikalitet och kameranarvaro.",
        },
      },
    ],
  },
  portfolio: {
    heading: {
      en: "An image-led portfolio for productions, campaigns, and theatre.",
      sv: "En bilddriven portfolio for produktioner, kampanjer och teater.",
    },
    intro: {
      en: "Use this section for hero projects, press stills, posters, fashion editorials, or behind-the-scenes highlights.",
      sv: "Anvand den har sektionen for huvudprojekt, pressbilder, affischer, editorials eller utvalda behind-the-scenes-bilder.",
    },
    items: [
      {
        image: "/images/portfolio-cold-sky.svg",
        link: "https://example.com/cold-sky",
        tag: {
          en: "Feature film",
          sv: "Langfilm",
        },
        title: {
          en: "Cold Sky",
          sv: "Cold Sky",
        },
        caption: {
          en: "Lead role in a Nordic suspense feature focused on stillness, pressure, and emotional fracture.",
          sv: "Huvudroll i en nordisk suspensefilm med fokus pa stillhet, press och emotionella sprickor.",
        },
      },
      {
        image: "/images/portfolio-glass-house.svg",
        link: "https://example.com/glass-house",
        tag: {
          en: "Streaming series",
          sv: "Streamingserie",
        },
        title: {
          en: "The Glass House",
          sv: "The Glass House",
        },
        caption: {
          en: "Supporting role in a prestige limited series with an elegant, high-contrast visual language.",
          sv: "Biroll i en prestige-miniserie med elegant och hogkontrast visuell ton.",
        },
      },
      {
        image: "/images/portfolio-hedda.svg",
        link: "https://example.com/hedda",
        tag: {
          en: "Stage production",
          sv: "Scenproduktion",
        },
        title: {
          en: "Hedda Gabler",
          sv: "Hedda Gabler",
        },
        caption: {
          en: "Contemporary theatre staging balancing sharp wit, fragility, and formal control.",
          sv: "Samtida teatertolkning som balanserar skarp intelligens, sarbarhet och formell kontroll.",
        },
      },
    ],
  },
  cv: {
    heading: {
      en: "Show the essentials on-page and keep the full CV one click away.",
      sv: "Visa det viktigaste pa sidan och lat hela CV:t ligga ett klick bort.",
    },
    intro: {
      en: "The layout below is designed for fast scanning by casting directors while still supporting downloadable PDFs.",
      sv: "Layouten nedan ar gjord for snabb scanning av casting directors och stoder samtidigt nedladdningsbara PDF-filer.",
    },
    files: [
      {
        locale: "en",
        href: "/cv/alex-arden-cv-en.pdf",
        label: {
          en: "Download English CV",
          sv: "Ladda ned engelskt CV",
        },
      },
      {
        locale: "sv",
        href: "/cv/alex-arden-cv-sv.pdf",
        label: {
          en: "Download Swedish CV",
          sv: "Ladda ned svenskt CV",
        },
      },
    ],
    groups: [
      {
        title: {
          en: "Selected screen credits",
          sv: "Utvalda screen credits",
        },
        items: {
          en: [
            "Cold Sky - Lead - dir. Mira Ek",
            "The Glass House - Supporting - Streamline Originals",
            "Borrowed Light - Guest lead - North Passage TV",
          ],
          sv: [
            "Cold Sky - Huvudroll - regi Mira Ek",
            "The Glass House - Biroll - Streamline Originals",
            "Borrowed Light - Gastroll - North Passage TV",
          ],
        },
      },
      {
        title: {
          en: "Selected theatre",
          sv: "Utvald teater",
        },
        items: {
          en: [
            "Hedda Gabler - Hedda - Royal Square Theatre",
            "Three Winters - Lina - Black Box Ensemble",
            "The Seagull - Nina - Riverside Stage",
          ],
          sv: [
            "Hedda Gabler - Hedda - Royal Square Theatre",
            "Three Winters - Lina - Black Box Ensemble",
            "Masen - Nina - Riverside Stage",
          ],
        },
      },
      {
        title: {
          en: "Training and skills",
          sv: "Utbildning och skills",
        },
        items: {
          en: [
            "MFA Acting - Stockholm Academy of Dramatic Arts",
            "Meisner Intensive - London Studio Collective",
            "Stage combat, dance fundamentals, standard drivers license",
          ],
          sv: [
            "MFA Acting - Stockholm Academy of Dramatic Arts",
            "Meisner Intensive - London Studio Collective",
            "Scenkamp, grund i dans, vanligt korkort",
          ],
        },
      },
    ],
  },
  photos: {
    heading: {
      en: "Build a strong visual story with portraits and stills.",
      sv: "Bygg en stark visuell berattelse med portratt och stillbilder.",
    },
    intro: {
      en: "The gallery supports headshots, editorial photography, production stills, and campaign images.",
      sv: "Galleriet stoder headshots, editorialfoto, produktionsstills och kampanjbilder.",
    },
    items: [
      {
        src: "/images/photo-sandstone.svg",
        orientation: "portrait",
        alt: {
          en: "Warm portrait with soft sandstone tones",
          sv: "Varmt portratt i mjuka sandtoner",
        },
      },
      {
        src: "/images/photo-stage-light.svg",
        orientation: "landscape",
        alt: {
          en: "Backstage scene with directional stage light",
          sv: "Backstage-scen med riktat scenljus",
        },
      },
      {
        src: "/images/photo-closeup.svg",
        orientation: "portrait",
        alt: {
          en: "Close-up portrait with editorial framing",
          sv: "Narabild i editorial framing",
        },
      },
      {
        src: "/images/photo-monochrome.svg",
        orientation: "square",
        alt: {
          en: "Monochrome studio portrait",
          sv: "Monokrom studiobild",
        },
      },
      {
        src: "/images/photo-motion.svg",
        orientation: "landscape",
        alt: {
          en: "Movement-focused still from a campaign shoot",
          sv: "Rorelsebetonad stillbild fran en kampanjfotografering",
        },
      },
      {
        src: "/images/photo-night.svg",
        orientation: "portrait",
        alt: {
          en: "Night portrait with dramatic contrast",
          sv: "Nattportratt med dramatisk kontrast",
        },
      },
    ],
  },
  links: {
    heading: {
      en: "Keep every important professional link in one clean place.",
      sv: "Samla alla viktiga professionella lankar pa ett rent stalle.",
    },
    intro: {
      en: "Add any platform that matters to your career: agent, IMDb, Spotlight, Instagram, personal website, or custom social links.",
      sv: "Lagg till de plattformar som spelar roll for din karriar: agent, IMDb, Spotlight, Instagram, egen webbplats eller andra sociala lankar.",
    },
    items: [
      {
        label: "Email",
        url: "mailto:alex@example.com",
        type: "email",
        note: {
          en: "For direct enquiries and availability.",
          sv: "For direktkontakt och tillganglighet.",
        },
      },
      {
        label: "Agent",
        url: "https://example.com/agent",
        type: "agent",
        note: {
          en: "Representation and booking details.",
          sv: "Representation och bokningsdetaljer.",
        },
      },
      {
        label: "IMDb",
        url: "https://www.imdb.com/",
        type: "imdb",
      },
      {
        label: "Spotlight",
        url: "https://www.spotlight.com/",
        type: "spotlight",
      },
      {
        label: "Instagram",
        url: "https://www.instagram.com/",
        type: "instagram",
      },
      {
        label: "Personal site",
        url: "https://example.com",
        type: "website",
        note: {
          en: "Use for press kits, news, or custom landing pages.",
          sv: "Anvand for presskit, nyheter eller egna landningssidor.",
        },
      },
    ],
  },
};
