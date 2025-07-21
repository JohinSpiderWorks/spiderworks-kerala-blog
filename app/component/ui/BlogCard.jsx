import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BASE_URL } from '@/baseUrl/baseUrl';
import Image from 'next/image';

export default function BlogCard({ blog }) {
  return (
    <Link
          href={`/blog/${blog.slug}`}
          // className="inline-flex items-center gap-2 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-all group"
        >
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Image Section */}
      <div className="relative h-48">
        {blog.premium && (
          <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[#FFD700] via-[#FFC300] to-[#FFB700] text-white text-xs font-medium rounded-full shadow-md z-10">
            Premium
          </span>
        )}

        {blog.bannerImage?.path ? (
          <Image
            src={`${BASE_URL}${blog.bannerImage.path}`}
            alt={blog.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-100 h-full flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            {new Date(blog.publish_date).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.short_description || 'No description available'}
        </p>
      </div>
    </div>
    </Link>
  );
}