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

export async function resizeImage(file: File): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('no 2d context»');
  }

  const bitmap = await createImageBitmap(file); // до try, const, без null

  try {
    const { width, height } = getTargetSize(bitmap.width, bitmap.height);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(bitmap, 0, 0, width, height);

    return await canvasToBlob(canvas);
  } finally {
    bitmap.close();
  }
}
