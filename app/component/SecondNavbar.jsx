"use client";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { debounce } from 'lodash';
import { BASE_URL } from "@/baseUrl/baseUrl";

export default function SecondNavbar() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleLinks, setVisibleLinks] = useState([]);
  const [hiddenLinks, setHiddenLinks] = useState([]);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [linksCalculated, setLinksCalculated] = useState(false);

  const navRef = useRef(null);
  const moreDropdownRef = useRef(null);
  const moreButtonRef = useRef(null);
  const testerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    testerRef.current = document.createElement("div");
    testerRef.current.style.position = "absolute";
    testerRef.current.style.visibility = "hidden";
    testerRef.current.style.whiteSpace = "nowrap";
    testerRef.current.style.fontSize = "14px";
    document.body.appendChild(testerRef.current);
    return () => {
      if (testerRef.current) document.body.removeChild(testerRef.current);
    };
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/blogs/staticpage?status=true`); // Or use BASE_URL if needed
        setBlogs(response.data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const calculateLinks = useMemo(() => debounce(() => {
    if (!isClient || !navRef.current || !testerRef.current) return;
    const navWidth = navRef.current.offsetWidth;
    const searchWidth = 0; // Adjust if you add a search bar
    const availableWidth = navWidth - searchWidth - 60;
    let totalWidth = 0;
    const tempVisible = [];
    const tempHidden = [];
    for (const blog of blogs) {
      testerRef.current.textContent = blog.heading || blog.name;
      const linkWidth = testerRef.current.offsetWidth + 32;
      if (totalWidth + linkWidth <= availableWidth) {
        tempVisible.push(blog);
        totalWidth += linkWidth;
      } else {
        tempHidden.push(blog);
      }
    }
    setVisibleLinks(tempVisible);
    setHiddenLinks(tempHidden);
    setLinksCalculated(true);
  }, 100), [isClient, blogs]);

  useEffect(() => {
    if (!isClient) return;
    calculateLinks();
    window.addEventListener("resize", calculateLinks);
    return () => {
      calculateLinks.cancel();
      window.removeEventListener("resize", calculateLinks);
    };
  }, [isClient, blogs, calculateLinks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreDropdownRef.current && !moreDropdownRef.current.contains(event.target) &&
        moreButtonRef.current && !moreButtonRef.current.contains(event.target)
      ) {
        setIsMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    <div className="max-w-[90rem] mx-auto px-6 py-2 relative z-20" ref={navRef}>
      {/* Old background blur/gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/20 via-pink-500/20 to-purple-500/20 blur-xl opacity-60 pointer-events-none"></div>
      {/* Nav contents */}
      <div className="relative flex items-center justify-between h-12 px-6">
        <ul className="flex flex-row font-medium space-x-6 text-sm">
          {(isClient && linksCalculated ? visibleLinks : blogs).map((blog) => (
            <li key={blog.slug} className="relative">
              <Link
                href={`/staticpages/${blog.slug}`}
                className="text-gray-900 hover:underline whitespace-nowrap"
              >
                {blog.heading || blog.name}
              </Link>
            </li>
          ))}
          {isClient && linksCalculated && hiddenLinks.length > 0 && (
            <li className="relative">
              <button
                ref={moreButtonRef}
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                className="flex items-center text-gray-900 hover:underline text-sm font-medium"
              >
                More
                <svg
                  className={`ml-1 w-4 h-4 transition-transform ${isMoreDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {isMoreDropdownOpen && (
                <div
                  ref={moreDropdownRef}
                  className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                >
                  {hiddenLinks.map((blog) => (
                    <Link
                      key={blog.slug}
                      href={`/staticpages/${blog.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMoreDropdownOpen(false)}
                    >
                      {blog.heading || blog.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
