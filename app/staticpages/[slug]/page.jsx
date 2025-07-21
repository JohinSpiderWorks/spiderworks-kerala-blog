"use client";

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { BASE_URL } from '@/baseUrl/baseUrl';

function toTitleCase(text) {
  return text
    .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function BlogDetail() {
  const params = useParams();
  const slug = params?.slug;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/blogs/staticpage`);
        const foundBlog = response.data.data.find(b => b.slug === slug);
        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-xl">Blog post not found</div>
      </div>
    );
  }

  let content = blog.content;
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      console.error('Error parsing blog content:', e);
      content = { fields: [], sections: [] };
    }
  }

  return (
    <div className="min-h-screen ">
      <Head>
        <title>{blog.meta_title || blog.heading || blog.name}</title>
        <meta name="description" content={blog.meta_description || content.short_description || ''} />
        <meta name="keywords" content={blog.meta_keywords || ''} />
        {blog.og_title && <meta property="og:title" content={blog.og_title} />}
        {blog.og_description && <meta property="og:description" content={blog.og_description} />}
        {blog.og_image && <meta property="og:image" content={blog.og_image} />}
      </Head>

      <main className="container mx-auto px-4 ">
        <article className="rounded-lg  overflow-hidden">
          <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 p-10 text-gray-800 bg-gradient-to-r from-amber-100 to-pink-100 text-center rounded-lg">
  {toTitleCase(blog.heading || blog.name)}
</h1>

            {content.short_description && (
              <p className="text-xl text-gray-600 mb-8">
                {content.short_description}
              </p>
            )}

            <div className="prose max-w-none">
              {Array.isArray(blog.contentKeyValue) && blog.contentKeyValue.length > 0 ? (
                blog.contentKeyValue.map((item, index) => (
                  <ContentItemRenderer key={index} item={item} />
                ))
              ) : (
                <p className="text-gray-500">No content available.</p>
              )}
            </div>

            {blog.bottom_description && blog.bottom_description.length > 0 && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                {blog.bottom_description.map((item, index) => (
                  <ContentItemRenderer key={index} item={item} />
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}

function ContentItemRenderer({ item }) {
  if (!item || !item.content) return null;

  const isHTML = typeof item.content === 'string' && item.content.trim().startsWith('<');
  const isImage = typeof item.content === 'string' && item.content.includes('/uploads/');
  const imageUrl = isImage ? `${BASE_URL}${item.content}` : null;

  return (
    <div className={`mb-6 ${item.width === 'half' ? 'w-1/2' : 'w-full'} p-2`}>
      {/* {item.heading && (
        <h3 className="text-xl font-semibold mb-2 text-gray-800 capitalize">
          {item.heading}
        </h3>
      )} */}

      {isImage ? (
        <img
          src={imageUrl}
          alt={item.heading}
          className="w-full h-auto rounded-lg"
        />
      ) : isHTML ? (
        <div dangerouslySetInnerHTML={{ __html: item.content }} className="prose" />
      ) : (
        <p className="text-gray-700 whitespace-pre-line">{item.content}</p>
      )}
    </div>
  );
}