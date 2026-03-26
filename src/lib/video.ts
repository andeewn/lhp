import type { VideoItem, VideoProvider } from "@/content/siteContent";

function cleanId(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return value.replace(/[^a-zA-Z0-9_-].*$/, "");
}

export function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const [id] = parsed.pathname.split("/").filter(Boolean);
      return cleanId(id);
    }

    if (
      host.endsWith("youtube.com") ||
      host === "youtube-nocookie.com" ||
      host.endsWith("youtube-nocookie.com")
    ) {
      const queryId = parsed.searchParams.get("v");

      if (queryId) {
        return cleanId(queryId);
      }

      const parts = parsed.pathname.split("/").filter(Boolean);
      const markerIndex = parts.findIndex((segment) =>
        ["embed", "shorts", "live"].includes(segment),
      );

      if (markerIndex !== -1 && parts[markerIndex + 1]) {
        return cleanId(parts[markerIndex + 1]);
      }

      return cleanId(parts.at(-1));
    }
  } catch {
    return null;
  }

  return null;
}

export function extractVimeoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (!host.endsWith("vimeo.com")) {
      return null;
    }

    const parts = parsed.pathname.split("/").filter(Boolean);

    for (let index = parts.length - 1; index >= 0; index -= 1) {
      if (/^\d+$/.test(parts[index])) {
        return parts[index];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getVideoEmbedUrl(video: Pick<VideoItem, "provider" | "url">): string | null {
  const provider: VideoProvider = video.provider;

  if (provider === "youtube") {
    const id = extractYouTubeId(video.url);
    return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : null;
  }

  const id = extractVimeoId(video.url);
  return id
    ? `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`
    : null;
}

export function pickFeaturedVideo<T extends { featured?: boolean }>(videos: T[]): T | null {
  return videos.find((video) => video.featured) ?? videos[0] ?? null;
}
