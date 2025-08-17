import { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { ProjectDoc } from '../data/projects'; // если нет — можешь заменить на свой тип

const COLLECTION = 'projects';

// Тип строки в таблице/списке
export type ProjectRow = ProjectDoc & { id: string };

export function useProjects() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      let snap;
      try {
        // предпочтительно сортировать по dateYMD
        snap = await getDocs(query(collection(db, COLLECTION), orderBy('dateYMD', 'desc')));
      } catch {
        // если индекса/поля нет — забираем как есть
        snap = await getDocs(collection(db, COLLECTION));
      }

      const list: ProjectRow[] = snap.docs.map((d) => {
        const data = d.data() as ProjectDoc | any;
        return { id: d.id, ...(data as ProjectDoc) };
      });

      // если без orderBy — сортанём по dateYMD локально
      list.sort((a, b) => {
        const aKey = String(a.dateYMD || '');
        const bKey = String(b.dateYMD || '');
        return aKey > bKey ? -1 : aKey < bKey ? 1 : 0;
      });

      setRows(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRows(); }, [loadRows]);

  // Создание/обновление
  const addOrUpdate = useCallback(
    async (payload: Omit<ProjectDoc, 'id'> & Record<string, any>, opts?: { editingId?: string }) => {
      const now = serverTimestamp();
      // На всякий случай выбрасываем id из payload
      // и не позволяем клиенту ставить свои timestamps
      const {
        id: _omitId,
        createdAt: _omitCreated,
        updatedAt: _omitUpdated,
        ...data
      } = payload;

      if (opts?.editingId) {
        await updateDoc(doc(db, COLLECTION, opts.editingId), {
          ...data,
          updatedAt: now,
        });
        return opts.editingId;
      } else {
        const ref = await addDoc(collection(db, COLLECTION), {
          ...data,
          createdAt: now,
          updatedAt: now,
        });
        return ref.id;
      }
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
  }, []);

  return { rows, loading, loadRows, addOrUpdate, remove };
}
