import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import { useFeedPosts } from "@/hooks/usePost";

const Explore = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const { ref, inView } = useInView();
  const limit = 10; // Number of posts per load

  const { data: posts, isLoading, isFetching } = useFeedPosts();

  // Combine all loaded posts
  useEffect(() => {
    if (posts) {
      setAllPosts(prev => [...prev, ...posts]);
    }
  }, [posts]);

  // Load more when scrolled to bottom
  useEffect(() => {
    if (inView && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [inView, isFetching]);

  if (isLoading && allPosts.length === 0) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Explore Posts</h2>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        <GridPostList posts={allPosts} />
      </div>

      {isFetching && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;