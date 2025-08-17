import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const safeName = (name: string) => name.replace(/\s+/g, '-');

export async function uploadFile(prefix: string, file: File): Promise<string> {
  const path = `${prefix}/${Date.now()}-${safeName(file.name)}`;
  const r = ref(storage, path);
  const metadata = { contentType: file.type || 'image/jpeg' }; 
  await uploadBytes(r, file, metadata);
  return getDownloadURL(r);
}

export async function uploadFiles(prefix: string, files: File[]): Promise<string[]> {
  return Promise.all(files.map((f) => uploadFile(prefix, f)));
}