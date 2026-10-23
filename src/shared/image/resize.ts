const MAX_SIZE = 1024;

export function getTargetSize(width: number, height: number, max = MAX_SIZE) {
  const ratio = Math.min(1, max / Math.max(width, height));

  return {
    width: width * ratio,
    height: height * ratio,
  };
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/jpeg',
  quality = 0.8,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return reject(new Error('toBlob returned null'));
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export async function resizeImage(file: Blob, max = MAX_SIZE): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('no 2d context»');
  }

  const bitmap = await createImageBitmap(file); // до try, const, без null

  try {
    const { width, height } = getTargetSize(bitmap.width, bitmap.height, max);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(bitmap, 0, 0, width, height);

    return await canvasToBlob(canvas);
  } finally {
    bitmap.close();
  }
}

/** Центральный кроп до квадрата 1:1 — для карточек альбома. */
export async function cropToSquare(image: Blob): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('no 2d context»');
  }

  const bitmap = await createImageBitmap(image);

  try {
    const side = Math.min(bitmap.width, bitmap.height);
    const sx = (bitmap.width - side) / 2;
    const sy = (bitmap.height - side) / 2;

    canvas.width = side;
    canvas.height = side;

    ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, side, side);

    return await canvasToBlob(canvas);
  } finally {
    bitmap.close();
  }
}

/** Поворот на 90° по часовой — для быстрой правки, без свободного угла. */
export async function rotateImage90(image: Blob): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('no 2d context»');
  }

  const bitmap = await createImageBitmap(image);

  try {
    canvas.width = bitmap.height;
    canvas.height = bitmap.width;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);

    return await canvasToBlob(canvas);
  } finally {
    bitmap.close();
  }
}
