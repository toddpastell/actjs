const images = new Map<string, HTMLImageElement>();

export async function load(urls: string[]): Promise<void> {
  await Promise.all(
    urls.map(async (url) => {
      if (images.has(url)) return;

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = url;
      await image.decode();

      images.set(url, image);
    }),
  );
}

export function image(url: string): HTMLImageElement {
  const found = images.get(url);
  if (!found) throw new Error("Asset not loaded");

  return found;
}
