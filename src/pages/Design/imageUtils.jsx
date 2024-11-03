const resizeMaskImage = async (encodedImage, encodedMaskImage) => {
  const loadImage = (encoded) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `data:image/png;base64,${encoded}`;
    });
  };

  const image = await loadImage(encodedImage);
  const maskImage = await loadImage(encodedMaskImage);

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");

  // Draw the mask image onto the canvas, scaling it to match the image dimensions
  ctx.drawImage(maskImage, 0, 0, image.width, image.height);

  // Convert the canvas content back to an image (assuming PNG format)
  return canvas.toDataURL("image/png").split(",")[1];
};

function saveBlobToFile(blob, fileName) {
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
}

function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

const encodeFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};

const resizeImage = async (imageUrl, maxWidth, maxPixels) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      let { width, height } = img;
      const aspectRatio = width / height;
      const currentPixels = width * height;

      if (currentPixels > maxPixels) {
        const scaleFactor = Math.sqrt(maxPixels / currentPixels);
        width = width * scaleFactor;
        height = height * scaleFactor;
      }

      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
  });
};

async function encodeBlobToBase64(blobUrl) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export {
  resizeMaskImage,
  saveBlobToFile,
  base64ToBlob,
  encodeFileToBase64,
  resizeImage,
  encodeBlobToBase64,
};
