const BLOGGER_ID = "4592459537376012257";
const API_KEY = "AIzaSyAo0sl8fAw-DNJ_nm3cqmxznd9LGgg1bhc";

function extraerStream(html) {
  const m = html.match(/<source\s+src="([^"]+\.m3u8[^"]*)"/i);
  return m ? m[1] : null;
}

function extraerLogo(html) {
  const m = html.match(/<img\s+src="([^"]+)"/i);
  return m ? m[1] : null;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function obtenerGrupos() {
  const url =
    "https://www.googleapis.com/blogger/v3/blogs/" + BLOGGER_ID + "/posts" +
    "?key=" + API_KEY + "&maxResults=500&orderBy=published" +
    "&fields=items(title,content,labels)";

  const res = await kino.fetch(url);
  if (!res.ok) throw kino.error("unavailable");

  const data = res.json();
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
      logo: logo || undefined,
      stream: { url: streamUrl },
    });
  }

  return grupos;
}

export async function home() {
  await null;
  return [];
}

export async function liveCategories() {
  await null;
  const grupos = await obtenerGrupos();
  return Object.entries(grupos).map(([nombre, canales]) => ({
    id: slugify(nombre),
    title: nombre,
    channels: canales,
  }));
}

export async function liveChannels({ categoryId }) {
  await null;
  const grupos = await obtenerGrupos();
  const key = Object.keys(grupos).find((k) => slugify(k) === categoryId);
  return { items: key ? grupos[key] : [] };
}

export async function resolve() {
  await null;
  throw kino.error("not_found");
}
