import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useGetAllPost } from "@/hooks/usePost";

const Home = () => {
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetAllPost();

  if (isErrorPosts) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 gap-8">
      {/* Main Content - Posts */}
      <div className="home-container flex-1">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full mb-6">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-8 w-full">
              {posts?.map((post) => (
                <li key={post.postId}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Sidebar - Users */}
      <div className="home-creators bg-slate-800 sticky top-0 h-screen overflow-y-auto p-4" style={{width:'30%'}}>
        <UserCard compact={true} />
      </div>
    </div>
  );
};

export default Home;