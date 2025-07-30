"use client";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BASE_URL } from "@/baseUrl/baseUrl";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/blogs/staticpage?status=true`);
        setBlogs(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Blog Links */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-6 overflow-x-auto">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-gray-800 whitespace-nowrap">
              Text
            </Link>

            {/* Blog Links */}
            {blogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/staticpages/${blog.slug}`}
                className="text-gray-700 hover:text-blue-600 text-sm whitespace-nowrap"
              >
                {blog.heading || blog.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}