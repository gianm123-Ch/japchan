export async function home() {
  return [];
}

export async function liveCategories() {
  return [
    {
      playlist: {
        url: "https://raw.githubusercontent.com/gianm123-Ch/japchan/main/jptvgo_final.m3u",
        format: "m3u",
        refreshHours: 24,
      },
    },
  ];
}

export async function liveChannels() {
  return { items: [] };
}

export async function resolve() {
  await null;
  throw kino.error("not_found");
}
