//const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

import { BASE_URL } from "@/baseUrl/baseUrl";

export async function getBlogs(page = 1, limit = 15) {
    const res = await fetch(`${BASE_URL}/blogs?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return await res.json();
}

export async function getBlogBySlug(slug) {
    const res = await fetch(`${BASE_URL}/blogs/slug/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch blog');
    return res.json();
}
  
export async function getFeaturedBlogs() {
  const res = await fetch(`${BASE_URL}/blogs/featured`);
  if (!res.ok) throw new Error('Failed to fetch featured blogs');
  return await res.json();
}

