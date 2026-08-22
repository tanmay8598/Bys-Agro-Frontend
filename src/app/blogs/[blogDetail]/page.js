

import BlogContent from './../../../components/Blog/BlogContent';
import apiClient from "../../../api/client";

export async function generateMetadata({ params }) {
 
  const resolvedParams = await params;
  const blogid = resolvedParams.blogDetail; 

  
  try {
    const response = await apiClient.get(`/blog/blogbyid/${blogid}`);
    
    return {
      title: response?.data?.mtitle || "Blog | BYS Agro",
      description: response?.data?.mdesc || "Read our latest blog from BYS Agro",
      openGraph: {
        images: response?.data?.image?.[0] ? [response.data.image[0]] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching blog for metadata:", error);
    return {
      title: "Blog | BYS Agro",
      description: "Read our latest blog from BYS Agro",
    };
  }
}

export default async function Page({ params }) {

  const resolvedParams = await params;
  const blogid = resolvedParams.blogDetail; 
  

  return <BlogContent blogid={blogid} />;
}