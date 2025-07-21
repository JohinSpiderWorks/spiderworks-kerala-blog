"use client";
import React, { useEffect, useState , useRef} from "react";
import {
  Bookmark,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  Menu,
  X,
  Home,
  BookOpen,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Zap,
  TrendingUp,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { BASE_URL } from "@/baseUrl/baseUrl";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SecondNavbar from "./SecondNavbar";
import { debounce } from "lodash";


const BlogNavbar = ({ isBookmarked, setIsBookmarked, blog, handleShare }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const shareMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const profileToggleRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = debounce(() => {
      setIsScrolled(window.scrollY > 20);
    }, 100); // debounce delay in ms
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel(); // cancel debounce on cleanup
    };
  }, []);

  // Fetch menu data and handle session
  useEffect(() => {
    setHasMounted(true);

    const fetchMenuData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/blogs/new/menu`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          const items = data.data[0].menuItems.map((item) => ({
            name: item.linkText,
            href: `/${item.url}`,
            newWindow: item.newWindow,
            icon:
              item.linkText === "Home"
                ? Home
                : item.linkText === "Blog"
                ? BookOpen
                : item.linkText === "Collections"
                ? Layers
                : item.linkText === "Bookmarks"
                ? Bookmark
                : BookOpen,
            color:
              item.linkText === "Home"
                ? "from-blue-400 to-cyan-400"
                : item.linkText === "Blog"
                ? "from-amber-400 to-pink-500"
                : item.linkText === "Collections"
                ? "from-purple-400 to-indigo-400"
                : item.linkText === "Bookmarks"
                ? "from-green-400 to-emerald-400"
                : "from-blue-400 to-cyan-400",
          }));
          setNavItems(items);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setNavItems([
          {
            name: "Home",
            href: "/",
            icon: Home,
            color: "from-blue-400 to-cyan-400",
          },
          {
            name: "Blog",
            href: "/blog",
            icon: BookOpen,
            color: "from-amber-400 to-pink-500",
          },
          // { name: "Collections", href: "/collections", icon: Layers, color: 'from-purple-400 to-indigo-400' },
          // { name: "Bookmarks", href: "/bookmarks", icon: Bookmark, color: 'from-green-400 to-emerald-400' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchMenuData();
    } else if (status === "unauthenticated") {
      setNavItems([
        // { name: "Home", href: "/", icon: Home, color: 'from-blue-400 to-cyan-400' },
        {
          name: "Blog",
          href: "/blog",
          icon: BookOpen,
          color: "from-amber-400 to-pink-500",
        },
        // { name: "Collections", href: "/collections", icon: Layers, color: 'from-purple-400 to-indigo-400' },
        // { name: "Bookmarks", href: "/bookmarks", icon: Bookmark, color: 'from-green-400 to-emerald-400' },
      ]);
      setLoading(false);
    }
  }, [session, status]);


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
        setShareMenuOpen(false);
      }
    
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileToggleRef.current &&
        !profileToggleRef.current.contains(event.target) // <-- ADD THIS CHECK
      ) {
        setIsProfileOpen(false);
      }
    
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShareClick = async (platform) => {
    await handleShare(platform);
    if (platform === "copy") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShareMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      // 1. Call backend to clear cookie/session
      await fetch(`${BASE_URL}/admin/logout`, {
        method: "POST",
        credentials: "include", // sends cookies if needed
      });

      // 2. Sign out from NextAuth and redirect
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const user = {
    name: session?.user?.name || "Guest User",
    email: session?.user?.email || "guest@blogspace.com",
    avatar:
      session?.user?.image ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
    role: session?.user?.role || "Reader",
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled
            ? "bg-white/20 backdrop-blur-2xl border-b border-white/10"
            : "bg-white "
        }`}
      >
        <div className="max-w-[90rem] mx-auto px-6 py-4">
          <div
            className={`relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10  transition-all duration-500 ${
              isScrolled ? "bg-white/10 shadow-xl" : "bg-white/5"
            }`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/20 via-pink-500/20 to-purple-500/20 blur-xl opacity-60"></div>

            <div className="relative flex items-center justify-between h-16 px-6">
              {/* Logo with animated elements */}
              <Link href="/">
                <div className="flex items-center space-x-3 group">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-pink-500 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-amber-400 to-pink-500 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-lg font-bold animate-pulse">
                        B
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-black to-gray-300 bg-clip-text text-transparent">
                      Blog
                    </h1>
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              {!loading && (
                <div className="hidden lg:flex items-center space-x-2">
                  {navItems.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        target={link.newWindow ? "_blank" : "_self"}
                        className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                          link.href === router.pathname
                            ? "text-black shadow-lg transform hover:scale-105"
                            : "text-gray-900 hover:text-gray-700 hover:bg-white/10 hover:scale-105"
                        }`}
                      >
                        {link.href === router.pathname && (
                          <>
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-xl opacity-90`}
                            ></div>
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-xl blur-lg opacity-60`}
                            ></div>
                          </>
                        )}
                        <Icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">{link.name}</span>
                        {!link.href === router.pathname && (
                          <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Right side actions */}
              <div className="flex items-center space-x-3">
                {/* Share button */}
                <div className="relative">
                  {shareMenuOpen && (
                    <div ref={shareMenuRef} className="absolute right-0 mt-3 w-48 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-slide-down">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-pink-500/10 to-purple-500/10"></div>
                      <div className="relative p-2">
                        {[
                          {
                            platform: "twitter",
                            icon: Twitter,
                            label: "Share on Twitter",
                          },
                          {
                            platform: "facebook",
                            icon: Facebook,
                            label: "Share on Facebook",
                          },
                          {
                            platform: "linkedin",
                            icon: Linkedin,
                            label: "Share on LinkedIn",
                          },
                          {
                            platform: "copy",
                            icon: copied ? Check : Copy,
                            label: copied ? "Copied!" : "Copy Link",
                          },
                        ].map((item) => (
                          <button
                            key={item.platform}
                            onClick={() => handleShareClick(item.platform)}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>

                {/* Profile dropdown */}
                {/* Auth section */}
                {session?.user ? (
                  // If user is logged in
                  <div className="relative">
                    <button
                     ref={profileToggleRef} 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-3 p-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-pink-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {session?.user?.image ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30 relative z-10"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold flex items-center justify-center text-sm ring-2 ring-white/30 relative z-10">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full ring-2 ring-black/50"></div>
                      </div>
                      <div className="hidden md:block text-left ">
                        <p className="text-sm font-medium text-gray-600 ">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors duration-300" />
                    </button>

                    {isProfileOpen && (
                      <div
                        ref={profileMenuRef}
                        className={`
                          absolute right-0 mt-3 w-72 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-slide-down
                          z-50
                          ${typeof window !== "undefined" && window.innerWidth < 1024 ? "fixed top-20 right-4 left-4 mx-auto w-auto" : ""}
                        `}
                        style={
                          typeof window !== "undefined" && window.innerWidth < 1024
                            ? { position: "fixed", top: "80px", left: "1rem", right: "1rem", margin: "0 auto", width: "auto" }
                            : {}
                        }
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-pink-500/10 to-purple-500/10"></div>
                        <div className="relative p-6 border-b border-white/10">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              {session?.user?.image ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold flex items-center justify-center text-lg">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full ring-2 ring-black"></div>
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {user.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {user.email}
                              </p>
                              <span className="inline-block mt-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-pink-500 text-white text-xs font-medium rounded-full">
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="relative p-2">
                          {[
                            // { icon: User, label: "Profile", href: "/profile" },
                            {
                              icon: Settings,
                              label: "Settings",
                              href: "/profile/settings",
                            },
                            // { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
                          ].map((item) => (
                            <Link
                            onClick={() => setIsProfileOpen(false)}
                              key={item.label}
                              href={item.href}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
                            >
                              <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                              <span>{item.label}</span>
                            </Link>
                          ))}
                          <hr className="my-2 border-white/10" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                          >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // If user is not logged in
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-400 to-pink-500 rounded-xl hover:from-amber-500 hover:to-pink-600 transition"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2.5 rounded-xl text-gray-400 hover:text-gray-900 transition-all duration-300 hover:bg-white/10 hover:scale-110"
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="relative z-10">
    <SecondNavbar/>
  </div>
        </div>

        {/* Mobile menu */}
        {hasMounted && isMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-6">
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-pink-500/10 to-purple-500/10"></div>
              <div className="relative p-4 space-y-2">
                {navItems.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      target={link.newWindow ? "_blank" : "_self"}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                        link.href === router.pathname
                          ? `bg-gradient-to-r ${link.color} text-white shadow-lg`
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>
     

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default BlogNavbar;
