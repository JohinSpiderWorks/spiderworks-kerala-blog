// app/blog/[slug]/page.jsx

import { getBlogBySlug } from '@/app/lib/api';
import BlogDetailClient from './BlogDetailClient';


// export async function generateMetadata({ params }) {
//   const blog = await getBlogBySlug(params.slug);
  
//   return {
//     title: blog?.title || 'Blog Post',
//     description: blog?.short_description || 'Read this blog post',
//     openGraph: {
//       title: blog?.title || 'Blog Post',
//       description: blog?.short_description || 'Read this blog post',
//       images: blog?.bannerImage?.path 
//         ? [{ url: blog.bannerImage.path }] 
//         : [],
//     },
//   };
// }

export default async function BlogDetailPage({ params }) {
  try {
    const blog = await getBlogBySlug(params.slug);
    if (!blog) return notFound();
    
    return <BlogDetailClient initialBlog={blog} />;
  } catch (error) {
    return <BlogDetailClient error={error.message} />;
  }
}