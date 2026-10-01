const BLOGGER_ID = "4592459537376012257";
const API_KEY = "AIzaSyAo0sl8fAw-DNJ_nm3cqmxznd9LGgg1bhc";
const MAX_RESULTS = 500;

function extraerStream(html) {
  const match = html.match(/<source\s+src="([^"]+\.m3u8[^"]*)"/)
  return match ? match[1] : null;
}

function extraerLogo(html) {
  const match = html.match(/<img\s+src="([^"]+)"/);
  return match ? match[1] : null;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function home() {
  await null;
  return [];
}

async function obtenerCanales() {
  const url =
    `https://www.googleapis.com/blogger/v3/blogs/${BLOGGER_ID}/posts` +
    `?key=${API_KEY}&maxResults=${MAX_RESULTS}&orderBy=published` +
    `&fields=items(title,content,labels)`;

  const res = await kino.fetch(url);
  if (!res.ok) throw kino.error("unavailable");

  const data = JSON.parse(res.body);
  const items = data.items || [];

  const grupos = {};
  for (const post of items) {
    const streamUrl = extraerStream(post.content || "");
    if (!streamUrl) continue;

    const logo = extraerLogo(post.content || "");
    const label = (post.labels && post.labels[0]) || "Otros";

    if (!grupos[label]) grupos[label] = [];
    grupos[label].push({
      id: slugify(post.title),
      title: post.title,
      thumbnail: logo || undefined,
      streams: [{ url: streamUrl }],
    });
  }

  return grupos;
}

export async function liveCategories() {
  await null;
  const grupos = await obtenerCanales();
  return Object.entries(grupos).map(([nombre, canales]) => ({
    id: slugify(nombre),
    title: nombre,
    channels: canales,
  }));
}

export async function liveChannels({ categoryId }) {
  await null;
  const grupos = await obtenerCanales();
  const canales = grupos[Object.keys(grupos).find(k => slugify(k) === categoryId)] || [];
  return { items: canales };
}

export async function resolve() {
  await null;
  throw kino.error("not_found");
}
