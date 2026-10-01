export async function home() {
  return [];
}

export async function liveCategories() {
  await null;
  return [
    {
      playlist: {
        url: kino.config.get("lista"),
        format: "m3u",
        refreshHours: 24,
      },
    },
  ];
}

export async function liveChannels() {
  await null;
  return { items: [] };
}

export async function resolve() {
  await null;
  throw kino.error("not_found");
}
