"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import BlogCard from './BlogCard';
import apiClient from './../../api/client';

const RelatedStories = ({ currentId }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await apiClient.get("/blog", { pageNumber: 1 });

      if (res.ok) {
        const filtered = res.data.blogs
          ?.filter((b) => b._id !== currentId)
          ?.slice(0, 3);

        setBlogs(filtered);
      }
    } catch (err) {
      console.log(err);
    }
  };

    if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#faf4ea] py-16 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2b1b12]">
            Related Stories
          </h2>

          <Link
            href="/blogs"
            className="border border-[#e6ded2] text-sm px-4 py-2 rounded-lg hover:bg-white hover:border-[#c1552c] hover:text-[#c1552c] transition text-[#5a4a3a]"
          >
            All stories
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blogData={blog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedStories;