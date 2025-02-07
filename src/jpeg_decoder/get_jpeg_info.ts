export const getJpegInfo = (base64: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      const o = ctx.getImageData(0, 0, img.width, img.height);
      const pixels = new Uint8Array(o.data);
      resolve({
        width,
        height,
        decodePixels: () => pixels,
      });
    };
    img.onerror = (e) => {
      console.error('Error loading image', e);
      reject(e);
    };
  });
};
