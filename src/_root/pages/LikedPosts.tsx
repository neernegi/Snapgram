import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useLikedPosts } from "@/hooks/usePost"; // Updated import
import { useUserContext } from "@/hooks/useUserContext";


const LikedPosts = () => {
  const { user: currentUser } = useUserContext();
  const { data: likedPosts, isLoading, isError } = useLikedPosts();

  if (isLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-center w-full h-full">
        <p className="text-light-4">Error loading liked posts</p>
      </div>
    );
  }

  if (!likedPosts || likedPosts.length === 0) {
    return (
      <div className="flex-center w-full h-full">
        <p className="text-light-4">No liked posts</p>
      </div>
    );
  }

  return (
    <>
      <GridPostList 
        posts={likedPosts} 
        showStats={false} 
        currentUser={currentUser}
      />
    </>
  );
};

export default LikedPosts;