
import { getBlogs, getFeaturedBlogs } from '../lib/api';
import BlogClient from './Blogclient';

export default async function BlogPage() {
  try {
    const [blogsData, featuredData] = await Promise.all([
      getBlogs(),
      getFeaturedBlogs()
    ]);

    return (
      <BlogClient 
      initialBlogs={blogsData?.data || []}
        initialFeaturedBlogs={featuredData?.data || featuredData || []}
        initialHasMore={blogsData?.data?.length === 15 && 1 < blogsData?.totalPages}
      />
    );
  } catch (error) {
    return <BlogClient initialError={error.message} />;
  }
}