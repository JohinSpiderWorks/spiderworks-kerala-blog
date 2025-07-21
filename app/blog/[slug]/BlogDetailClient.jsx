"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Bookmark,
  Share2,
  MessageSquare,
  ArrowLeft,
  Heart,
  ChevronUp,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  ThumbsUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import BlogComments from "./BlogComments";
import { formatDate } from "@/app/lib/utils";
import { BASE_URL } from "@/baseUrl/baseUrl";
import axios from "axios";

const BlogDetailClient = ({ initialBlog = null, error = null }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [blog, setBlog] = useState(initialBlog);
  const [isLoading, setIsLoading] = useState(!initialBlog);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favouriteId, setFavouriteId] = useState(null);

  // Fetch blog if not provided by server
  useEffect(() => {
    if (params?.slug) {
      const fetchBlog = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/blogs/slug/${params.slug}`);
          const blogData = res.data.data;
          setBlog(blogData);
          initializeLikeState(blogData);
        } catch (err) {
          console.error("Error fetching blog:", err);
          setError(
            err.response?.data?.message || err.message || "Unknown error"
          );
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchBlog();
    }
  }, [params?.slug, initialBlog, session]);

  useEffect(() => {
    if (blog) {
      initializeLikeState(blog);
    }
  }, [session]); // This will update the like state when user logs in/out
  

  const initializeLikeState = (blogData) => {
    const totalLikes = blogData?.favourite?.length || 0;
    setLikes(totalLikes);
  
    // Reset like state if no session
    if (!session?.user?.id) {
      setIsLiked(false);
      setFavouriteId(null);
      return;
    }
  
    // Check if current user has liked the post
    if (blogData?.favourite) {
      const userFavourite = blogData.favourite.find(
        (fav) => fav.user_id === session.user.id
      );
      setIsLiked(!!userFavourite);
      setFavouriteId(userFavourite?.id || null);
    } else {
      setIsLiked(false);
      setFavouriteId(null);
    }
  };

  // Like toggle handler
  const handleLikeToggle = async () => {
    if (!session?.accessToken) {
      toast.error("Please sign in to like this post");
      return;
    }

    const wasLiked = isLiked;
    const previousLikes = likes;
    const previousFavouriteId = favouriteId;

    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikes(wasLiked ? likes - 1 : likes + 1);

    try {
      if (wasLiked && favouriteId) {
        await fetch(`${BASE_URL}/blogs/${blog.id}/favourite/${favouriteId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        setFavouriteId(null);
      } else {
        const response = await fetch(`${BASE_URL}/blogs/${blog.id}/favourite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        setFavouriteId(data.id);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      toast.error("Failed to toggle like");
      // Revert optimistic update
      setIsLiked(wasLiked);
      setLikes(previousLikes);
      setFavouriteId(previousFavouriteId);
    }
  };

  // Scroll progress handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setReadingProgress(scrollPercent);
      setShowScrollTop(scrollTop > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Share handler
  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = blog?.title || "";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
    setShareMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">
            {error || "Blog post not found"}
          </p>
          <Link
            href="/blog"
            className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-200"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Floating Navigation */}
      <nav className="fixed mt-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-lg border border-white/50 rounded-full px-6 py-3 shadow-2xl z-40">
        <div className="flex items-center justify-between space-x-6">
          <Link
            href="/blog"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLikeToggle}
              className={`p-2 rounded-full transition-all duration-200 ${
                isLiked
                  ? "bg-gradient-to-br from-pink-100 to-red-100 text-red-600 shadow-md"
                  : "hover:bg-gray-100 text-gray-500 hover:text-red-600"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  isLiked ? "fill-current animate-heart-beat" : ""
                }`}
              />
            </button>

            <div className="relative">
              <button
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  shareMenuOpen
                    ? "bg-gradient-to-br from-blue-200 to-blue-300 text-blue-700 shadow-md"
                    : "hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                }`}
              >
                <Share2 className="w-4 h-4" />
              </button>

              {shareMenuOpen && (
                <div className="absolute top-12 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 min-w-48 animate-fade-in">
                  <div className="space-y-2">
                    <button
                      onClick={() => handleShare("twitter")}
                      className="flex items-center w-full px-3 py-2 text-left hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                    >
                      <Twitter className="w-4 h-4 mr-3 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="flex items-center w-full px-3 py-2 text-left hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                    >
                      <Facebook className="w-4 h-4 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center w-full px-3 py-2 text-left hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                    >
                      <Linkedin className="w-4 h-4 mr-3 text-blue-700 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="flex items-center w-full px-3 py-2 text-left hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 mr-3 text-green-500 group-hover:scale-110 transition-transform" />
                      ) : (
                        <Copy className="w-4 h-4 mr-3 text-gray-500 group-hover:scale-110 transition-transform" />
                      )}
                      <span className="text-sm">
                        {copied ? "Copied!" : "Copy Link"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-pink-500 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-0.5">
              {blog.premium ? "Premium Content" : "Blog Post"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 max-w-3xl">
            {blog.short_description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Author Info */}
            <div className="flex items-center space-x-4">
              <img
                src={
                  blog.blogAuthor?.image
                    ? `${BASE_URL}${blog.blogAuthor.image}`
                    : "/default-avatar.jpg"
                }
                alt={blog.blogAuthor?.name || "Author"}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg hover:ring-amber-200 transition-all duration-300"
              />
              <div>
                <p className="font-semibold text-lg text-gray-900">
                  {blog.blogAuthor?.name || "Anonymous"}
                </p>
                <p className="text-gradient bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent font-medium">
                  {blog.blogAuthor?.profession || "Blog Author"}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-gray-500">
              <span className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span className="font-medium">
                  {formatDate(blog.publish_date)}
                </span>
              </span>
              <span className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <span className="font-medium">{likes}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500">
          <img
            src={`${BASE_URL}${blog.bannerImage?.path}`}
            alt={blog.title}
            className="w-full h-[400px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article Content */}
          <article className="lg:col-span-8">
            {/* Top Description */}
            {blog.top_description && (
              <div
                className="text-gray-500 mb-12 p-6 bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl border-l-4 border-amber-400 shadow-sm hover:shadow-md transition-shadow"
                dangerouslySetInnerHTML={{ __html: blog.top_description }}
              />
            )}

            {/* Sections */}
            {blog.sections?.map((section, index) => (
              <section key={index} className="mb-12">
                {section.heading && (
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 relative before:absolute before:bottom-0 before:left-0 before:w-16 before:h-1 before:bg-gradient-to-r before:from-amber-400 before:to-pink-500">
                    {section.heading}
                  </h2>
                )}
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))}

            {/* Bottom Description */}
            {blog.bottom_description && (
              <div
                className="text-gray-500 mb-12 p-6 bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl border-l-4 border-amber-400 shadow-sm hover:shadow-md transition-shadow"
                dangerouslySetInnerHTML={{ __html: blog.bottom_description }}
              />
            )}

            {/* Engagement */}
            <div className="flex items-center justify-between py-8 px-6 bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl mb-12 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    isLiked
                      ? "bg-gradient-to-br from-pink-100 to-red-100 text-red-600 shadow-md"
                      : "bg-white hover:bg-gray-50 text-gray-600 hover:text-red-600"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked ? "fill-current animate-heart-beat" : ""
                    }`}
                  />
                  <span className="font-medium">{likes}</span>
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Found this helpful? Share it with others!
              </div>
            </div>

            {/* Comments Section */}
            <BlogComments
              blogId={blog.id}
              initialComments={blog.comments || []}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* Author Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="text-center">
                  <img
                    src={
                      blog.blogAuthor?.image
                        ? `${BASE_URL}${blog.blogAuthor.image}`
                        : "/default-avatar.jpg"
                    }
                    alt={blog.blogAuthor?.name || "Author"}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-amber-100 hover:ring-amber-200 transition-all duration-300"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {blog.blogAuthor?.name || "Anonymous"}
                  </h3>
                  <p className="text-gradient bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent font-medium mb-4">
                    {blog.blogAuthor?.profession || "Blog Author"}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {blog.blogAuthor?.about || "No bio available."}
                  </p>
                  <button className="w-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold py-3 rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105 hover:from-amber-500 hover:to-pink-600">
                    Follow Author
                  </button>
                </div>
              </div>

              {/* Category Tags */}
              {/* <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog?.blog_categories?.length > 0 ? (
                    blog.blog_categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/blog/category/${category.slug}`}
                        className="inline-block px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full hover:from-blue-100 hover:to-purple-100 transition-colors cursor-pointer"
                      >
                        #{category.name}
                      </Link>
                    ))
                  ) : (
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-500 rounded-full">
                      #No categories
                    </span>
                  )}
                </div>
              </div> */}

<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
  <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
  <div className="flex flex-wrap gap-2">
    {blog?.blog_categories?.length > 0 ? (
      blog.blog_categories.map((category) => (
        <span
          key={category.id}
          className="inline-block px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full hover:from-blue-100 hover:to-purple-100 transition-colors cursor-default"
        >
          #{category.name}
        </span>
      ))
    ) : (
      <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-500 rounded-full">
        #No categories
      </span>
    )}
  </div>
</div>

            </div>
          </aside>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-400 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-40"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes heartBeat {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.2);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-heart-beat {
          animation: heartBeat 0.8s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .text-gradient {
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default BlogDetailClient;