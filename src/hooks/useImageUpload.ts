import { useCallback, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    setUploading(true);
    setProgress(0);

    const safeName = file.name.replace(/\s+/g, '-');
    const path = `news/${Date.now()}-${safeName}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'image/jpeg',
    });

    return await new Promise<string>((resolve, reject) => {
      task.on('state_changed', s => {
        setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100));
      }, reject, async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (e) {
          reject(e);
        } finally {
          setUploading(false);
        }
      });
    });
  }, []);

  const resetUpload = useCallback(() => {
    setUploading(false);
    setProgress(0);
  }, []);

  return { uploading, progress, uploadImage, resetUpload };
}