export const readAsText = async (file: File): Promise<string> => file.text();

export const readAsArrayBuffer = async (file: File): Promise<ArrayBuffer> => file.arrayBuffer();

export const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const sanitizeLooseText = (input: string): string =>
  input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
