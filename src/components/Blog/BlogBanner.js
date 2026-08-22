import React from "react";

const BlogBanner = ({ title, subtitle }) => {
  return (
    <div className=" pt-4 pb-4">
      <h1 className="text-black text-xl md:text-2xl font-semibold font-cursive">
        {title}
      </h1>
      <p className="text-black text-base md:text-lg font-regular">{subtitle}</p>
    </div>
  );
};

export default BlogBanner;
