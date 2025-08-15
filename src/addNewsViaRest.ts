import { auth } from "../firebase";

export async function addNewsViaRest(data: {
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  dateISO: string;
  category: string;
  featured: boolean;
  authorEmail?: string | null;
  projectId?: string; // default: github-b91ab
}) {
  const projectId = data.projectId || "github-b91ab";
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error("No auth token");

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/news`;

  const body = {
    fields: {
      title:       { stringValue: data.title },
      slug:        { stringValue: data.slug },
      excerpt:     { stringValue: data.excerpt },
      image:       { stringValue: data.image },
      date:        { timestampValue: data.dateISO },
      category:    { stringValue: data.category },
      featured:    { booleanValue: data.featured },
      authorEmail: data.authorEmail ? { stringValue: data.authorEmail } : { nullValue: null },
      createdAt:   { timestampValue: new Date().toISOString() },
      updatedAt:   { timestampValue: new Date().toISOString() },
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `REST write failed: ${res.status}`);
  }
  return res.json();
}
