import { describe, expect, it } from "vitest";

import {
  extractVimeoId,
  extractYouTubeId,
  getVideoEmbedUrl,
  pickFeaturedVideo,
} from "./video";

describe("extractYouTubeId", () => {
  it("parses standard watch URLs", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=jNQXAC9IVRw")).toBe(
      "jNQXAC9IVRw",
    );
  });

  it("parses short URLs", () => {
    expect(extractYouTubeId("https://youtu.be/ysz5S6PUM-U")).toBe("ysz5S6PUM-U");
  });

  it("parses shorts URLs", () => {
    expect(extractYouTubeId("https://www.youtube.com/shorts/abc123DEF45")).toBe(
      "abc123DEF45",
    );
  });
});

describe("extractVimeoId", () => {
  it("parses direct Vimeo URLs", () => {
    expect(extractVimeoId("https://vimeo.com/76979871")).toBe("76979871");
  });

  it("parses player URLs", () => {
    expect(extractVimeoId("https://player.vimeo.com/video/76979871")).toBe("76979871");
  });
});

describe("getVideoEmbedUrl", () => {
  it("builds a YouTube embed URL", () => {
    expect(
      getVideoEmbedUrl({
        provider: "youtube",
        url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      }),
    ).toContain("/embed/jNQXAC9IVRw");
  });

  it("builds a Vimeo embed URL", () => {
    expect(
      getVideoEmbedUrl({
        provider: "vimeo",
        url: "https://vimeo.com/76979871",
      }),
    ).toContain("/video/76979871");
  });
});

describe("pickFeaturedVideo", () => {
  it("uses the explicitly featured entry first", () => {
    const items = [
      { id: "one" },
      { id: "two", featured: true },
      { id: "three" },
    ];

    expect(pickFeaturedVideo(items)).toEqual(items[1]);
  });

  it("falls back to the first item when none are featured", () => {
    const items = [{ id: "first" }, { id: "second" }];

    expect(pickFeaturedVideo(items)).toEqual(items[0]);
  });
});
