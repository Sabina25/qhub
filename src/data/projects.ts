import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { LinkRef } from '../utils/html';

export type Lang = 'ua' | 'en';
export type L10n<T> = Record<Lang, T>;

export type ProjectDoc = {
  id?: string;               
  slug?: L10n<string>;
  title: L10n<string>;
  descriptionHtml: L10n<string>;     
  descriptionLinks?: L10n<LinkRef[]>;
  image: string;                     
  gallery: string[];                 
  dateYMD?: string;                  
  dateStartYMD?: string;             
  dateEndYMD?: string;
  location?: string;
  youtubeUrls: string[];           
  featured: boolean;
  createdAt?: any;
  updatedAt?: any;
  authorEmail?: string | null;
};

const COLL = 'projects';

function toL10nString(val: any): L10n<string> {
  if (typeof val === 'string') return { ua: val, en: val };
  if (val && typeof val === 'object') {
    const ua = typeof val.ua === 'string' ? val.ua : (typeof val.en === 'string' ? val.en : '');
    const en = typeof val.en === 'string' ? val.en : (typeof val.ua === 'string' ? val.ua : '');
    return { ua, en };
  }
  return { ua: '', en: '' };
}
function toL10nLinks(val: any): L10n<LinkRef[]> {
  if (Array.isArray(val)) return { ua: val, en: val };
  if (val && typeof val === 'object') {
    return {
      ua: Array.isArray(val.ua) ? val.ua : (Array.isArray(val.en) ? val.en : []),
      en: Array.isArray(val.en) ? val.en : (Array.isArray(val.ua) ? val.ua : []),
    };
  }
  return { ua: [], en: [] };
}

export async function addProjectToDB(data: Omit<ProjectDoc, 'id'>): Promise<string> {
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COLL), payload as any);
  return ref.id;
}

export async function updateProjectInDB(id: string, data: Partial<ProjectDoc>): Promise<void> {
  const ref = doc(db, COLL, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() } as any);
}

export async function removeProjectInDB(id: string): Promise<void> {
  await deleteDoc(doc(db, COLL, id));
}

export async function fetchProjects(): Promise<ProjectDoc[]> {
  let snap;
  try {
    snap = await getDocs(query(collection(db, COLL), orderBy('dateYMD', 'desc')));
  } catch {
    snap = await getDocs(collection(db, COLL));
  }
  const list: ProjectDoc[] = snap.docs.map((d) => {
    const data: any = d.data() || {};
    // fallback для старой схемы: title/descriptionHtml как строки
    const title = toL10nString(data.title);
    const descriptionHtml = toL10nString(data.descriptionHtml);
    const descriptionLinks = toL10nLinks(data.descriptionLinks);
    return {
      id: d.id,
      slug: data.slug ? toL10nString(data.slug) : undefined,
      title,
      descriptionHtml,
      descriptionLinks,
      image: data.image || '',
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
      dateYMD: data.dateYMD || '',
      dateStartYMD: data.dateStartYMD || '',
      dateEndYMD: data.dateEndYMD || '',
      location: data.location || '',
      youtubeUrls: Array.isArray(data.youtubeUrls) ? data.youtubeUrls : [],
      featured: !!data.featured,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      authorEmail: data.authorEmail || null,
    } as ProjectDoc;
  });
  list.sort((a, b) => (String(a.dateYMD||'') > String(b.dateYMD||'') ? -1 : 1));
  return list;
}

export async function fetchProjectById(id: string): Promise<ProjectDoc | null> {
  const ref = doc(db, COLL, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data: any = snap.data() || {};
  return {
    id: snap.id,
    slug: data.slug ? toL10nString(data.slug) : undefined,
    title: toL10nString(data.title),
    descriptionHtml: toL10nString(data.descriptionHtml),
    descriptionLinks: toL10nLinks(data.descriptionLinks),
    image: data.image || '',
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    dateYMD: data.dateYMD || '',
    dateStartYMD: data.dateStartYMD || '',
    dateEndYMD: data.dateEndYMD || '',
    location: data.location || '',
    youtubeUrls: Array.isArray(data.youtubeUrls) ? data.youtubeUrls : [],
    featured: !!data.featured,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    authorEmail: data.authorEmail || null,
  } as ProjectDoc;
}