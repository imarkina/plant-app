export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const imageUrlToBase64 = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return blobToBase64(blob);
};
