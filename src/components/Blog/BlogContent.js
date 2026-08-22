
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Parser } from "html-to-react";
import RelatedStories from './RelatedStories';
import apiClient from './../../api/client';
import Loader from './../../utility/Loader';
import { FaShareAlt } from "react-icons/fa";

const getReadingTime = (html) => {
  const text = html?.replace(/<[^>]*>?/gm, "") || "";
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};

const BlogContent = ({ blogid }) => {

  
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const articleRef = useRef();

  useEffect(() => {
    if (blogid) {
      fetchBlog();
    } else {
      console.error("No blog ID provided");
      setLoading(false);
    }
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blogid]);

  const fetchBlog = async () => {
    try {
  
      const res = await apiClient.get(`blog/blogbyid/${blogid}`);

    

      if (res.ok) {
        setData(res.data);
        setReadingTime(getReadingTime(res.data.content));
      } else {
        console.error("Blog not found");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (!articleRef.current) return;

    const total =
      articleRef.current.offsetHeight - window.innerHeight;
    const current = window.scrollY - articleRef.current.offsetTop;

    if (current >= 0) {
      setProgress(Math.min((current / total) * 100, 100));
    }
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleShare = async () => {
    if (!navigator.share) {
      alert("Sharing not supported on this browser");
      return;
    }

    try {
      await navigator.share({
        title: data.heading,
        text: data.mdesc,
        url: window.location.href,
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <Loader />;

  if (!data || !data._id) {
    return (
      <div className="bg-[#faf4ea] min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-[#2b1b12] mb-2">Blog Not Found</h2>
          <p className="text-[#5a4a3a]">The blog post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf4ea] min-h-screen ">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#c1552c] z-50 transition-all duration-200"
        style={{ width: `${progress}%` }}
      />

      <div className="max-w-4xl mx-auto px-5 md:px-10 py-8">
        {/* Category */}
        <p className="text-xs tracking-widest uppercase text-[#c1552c] text-center mb-3 font-semibold">
          BYS Agro Journal
        </p>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-center text-[#2b1b12] leading-tight mb-4">
          {Parser().parse(data.heading || "") || data.heading || "Untitled"}
        </h1>

        {/* Description */}
        <p className="text-center text-[#5a4a3a] max-w-2xl mx-auto text-sm md:text-base mb-6 leading-relaxed">
          {data.mdesc || "No description available"}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#8a8179] mb-10">
          <span>
            {data.createdAt
              ? new Date(data.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Recently"}
          </span>

          <span className="w-1 h-1 bg-[#e6ded2] rounded-full"></span>

          <span>{readingTime} min read</span>

          <span className="w-px h-4 bg-[#e6ded2] mx-2"></span>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e6ded2] hover:bg-white hover:border-[#c1552c] hover:text-[#c1552c] transition-all duration-200"
          >
            <FaShareAlt size={12} className="text-[#8a8179] group-hover:text-[#c1552c]" />
            <span className="text-xs text-[#5a4a3a]">Share</span>
          </button>
        </div>

        {/* Featured Image */}
        {data.image?.[0] && (
          <div className="relative h-65 md:h-105 rounded-3xl overflow-hidden mb-12">
            <Image
              src={data.image[0]}
              alt={data.heading || "Blog post image"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <article
          ref={articleRef}
          className="prose prose-lg max-w-none text-[#2b1b12] prose-headings:text-[#2b1b12] prose-headings:font-serif prose-p:text-[#5a4a3a] prose-p:leading-relaxed prose-strong:text-[#2b1b12] prose-ul:text-[#5a4a3a] prose-li:text-[#5a4a3a]"
        >
          {Parser().parse(data.content || "<p>No content available</p>")}
        </article>

        {/* Author Section */}
        <div className="mt-10 bg-[#efe8dd] rounded-2xl p-6 flex items-center gap-4 border border-[#e6ded2]">
          <div className="w-12 h-12 rounded-full bg-[#c1552c] text-white flex items-center justify-center font-bold text-lg">
            {getInitials(data?.user || "BYS Agro")}
          </div>
          <div>
            <h4 className="font-semibold text-[#2b1b12]">
              {data?.user || "BYS Agro Team"}
            </h4>
            <p className="text-sm text-[#5a4a3a]">
              Sharing stories from Indian farms and kitchens.
            </p>
          </div>
        </div>
      </div>

      {/* Related Stories */}
      <RelatedStories currentId={data._id} />
    </div>
  );
};

export default BlogContent;