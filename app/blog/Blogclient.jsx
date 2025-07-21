'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, ArrowRight, Calendar, Heart, Bookmark, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import BlogCard from '../component/ui/BlogCard';
import { getBlogs } from '../lib/api';
import { formatDate } from '@/app/lib/utils';
import { BASE_URL } from '@/baseUrl/baseUrl';

export default function BlogClient({ initialBlogs = [], initialFeaturedBlogs = [], initialHasMore = true, initialError = null }) {
  // console.log("initialBlogs", initialBlogs);
  // console.log("initialFeaturedBlogs", initialFeaturedBlogs);

  const [searchTerm, setSearchTerm] = useState('');
  const [blogs, setBlogs] = useState(initialBlogs);
  const [featuredBlogs, setFeaturedBlogs] = useState(initialFeaturedBlogs);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(initialError);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const loadMore = useCallback(async () => {
    if (!hasMore || isFetching) return;
    
    setIsFetching(true);
    try {
      const nextPage = page + 1;
      const data = await getBlogs(nextPage);
      setBlogs(prev => [...prev, ...(data.data || [])]);
      setHasMore(data.data?.length === 15 && nextPage < data.totalPages);
      setPage(nextPage);
    } catch (err) {
      setError('Failed to load more blogs');
      toast.error('Failed to load more blogs');
    } finally {
      setIsFetching(false);
    }
  }, [page, hasMore, isFetching]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const filteredBlogs = blogs.filter(blog => 
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchError("Please enter a search term");
      return;
    }
    setIsSearching(true);
    setSearchError("");
    setTimeout(() => setIsSearching(false), 1000);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
    {/* Header Section */}
    <header className="bg-gradient-to-r from-amber-400 to-pink-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white">
          Blog
        </h1>
        <p className="text-xl text-pink-100 max-w-3xl mx-auto">
          Expert articles on technology, business, design, and more to help
          you stay informed and inspired.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchError("");
              }}
              className={`focus:outline-none w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border ${
                searchError ? "border-red-400" : "border-pink-300/30"
              } rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-pink-200 text-white transition-all duration-200 focus:shadow-lg`}
              aria-label="Search articles"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              </div>
            )}
          </form>
          {searchError && (
            <p className="text-red-400 text-sm mt-2">{searchError}</p>
          )}
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Only show featured and latest articles when not searching */}
      {!searchTerm && (
        <>
          {/* Featured Post */}
          {featuredBlogs.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
                Featured Article
              </h2>
              {featuredBlogs.map(featuredBlog => (
                <div
                  key={featuredBlog.id}
                  className="bg-white mb-10 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
                >
                  <div className="md:flex">
                    <div className="md:flex-1">
                      {featuredBlog.bannerImage?.path ? (
                        <img
                          src={`${BASE_URL}${featuredBlog.bannerImage?.path}`}
                          alt={featuredBlog.title}
                          className="w-full h-64 sm:h-80 object-cover"
                        />
                      ) : (
                        <div className="w-full h-64 sm:h-80 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-8 md:flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        {featuredBlog.premium && (
                          <span className="px-3 py-1 bg-gradient-to-r from-[#FFD700] via-[#FFC300] to-[#FFB700] text-white text-xs font-medium rounded-full shadow-md">
                          Premium
                        </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(featuredBlog.publish_date)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-4">
                        {featuredBlog.title}
                      </h3>
                      <p className="text-base text-gray-600 mb-6">
                        {featuredBlog.short_description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {featuredBlog.blogAuthor?.image && (
                            <img
                              src={featuredBlog.blogAuthor.image}
                              alt={featuredBlog.blogAuthor.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {featuredBlog.blogAuthor?.name || "Unknown Author"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {featuredBlog.blogAuthor?.profession || ""}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/blog/${featuredBlog.slug}`}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-pink-500 hover:from-pink-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300"
                        >
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} isFeatured={index === 0} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Show search results when searching */}
      {searchTerm && (
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            Search Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isFetching && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      )}

      {/* No Results */}
      {searchTerm && filteredBlogs.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No articles found
          </h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}

      {/* End of Results */}
      {!hasMore && blogs.length > 0 && !searchTerm && (
        <div className="text-center text-2xl font-bold py-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-pink-500">
          You've reached the end of the list
        </div>
      )}
    </main>
  </div>
);
}