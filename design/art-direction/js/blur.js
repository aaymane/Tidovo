// Pre-computed blur by progressive downsampling (works in Safari, no ctx.filter needed).
export async function loadImage(src) {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  await img.decode();
  return img;
}

// factor: size of the smallest intermediate relative to the source width (1/40 = very blurry).
export function blurredCanvas(img, factor = 1 / 32, outWidth = 360) {
  let w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
  const ratio = h / w;
  const minW = Math.max(4, Math.round(w * factor));
  let src = img;
  while (w / 2 >= minW) {
    w = Math.round(w / 2); h = Math.round(h / 2);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    x.drawImage(src, 0, 0, w, h);
    src = c;
  }
  // Two-step upscale keeps the blur smooth instead of blocky.
  const mid = document.createElement('canvas');
  mid.width = Math.max(8, Math.round(outWidth / 3)); mid.height = Math.round(mid.width * ratio);
  const mx = mid.getContext('2d'); mx.imageSmoothingEnabled = true; mx.imageSmoothingQuality = 'high';
  mx.drawImage(src, 0, 0, mid.width, mid.height);
  const out = document.createElement('canvas');
  out.width = outWidth; out.height = Math.round(outWidth * ratio);
  const ox = out.getContext('2d'); ox.imageSmoothingEnabled = true; ox.imageSmoothingQuality = 'high';
  ox.drawImage(mid, 0, 0, out.width, out.height);
  return out;
}
