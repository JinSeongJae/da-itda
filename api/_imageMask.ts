import sharp from 'sharp';

interface Box {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Draws a solid black rectangle over `box` (normalized 0-1 coords) and re-encodes as JPEG. */
export async function maskRegion(buffer: Buffer, box: Box): Promise<Buffer> {
  const image = sharp(buffer).rotate(); // normalize EXIF orientation before measuring
  const { width, height } = await image.metadata();
  if (!width || !height) {
    throw new Error('이미지 크기를 확인할 수 없습니다.');
  }

  const xMin = clamp01(box.xMin);
  const yMin = clamp01(box.yMin);
  const xMax = clamp01(Math.max(box.xMax, xMin));
  const yMax = clamp01(Math.max(box.yMax, yMin));

  const left = Math.round(xMin * width);
  const top = Math.round(yMin * height);
  const rectWidth = Math.max(1, Math.min(width - left, Math.round((xMax - xMin) * width)));
  const rectHeight = Math.max(1, Math.min(height - top, Math.round((yMax - yMin) * height)));

  const blackRect = await sharp({
    create: { width: rectWidth, height: rectHeight, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .jpeg()
    .toBuffer();

  return image.composite([{ input: blackRect, left, top }]).jpeg({ quality: 85 }).toBuffer();
}
