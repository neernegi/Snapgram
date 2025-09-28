import { Link } from "react-router-dom";

import PostStats from "./PostStats";
import { GridPostListProps } from "@/types/interfaces";
import { useUserContext } from "@/hooks/useUserContext";


const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
  currentUser,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.postId} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.postId}`} className="grid-post_link">
            <img
              src={post.images[0]} // Use first image from images array
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && post.user && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post.user.profileImage ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1 text-white text-[19px]">
                  {post.user.displayName || post.user.username}
                </p>
              </div>
            )}
            {showStats && (
              <PostStats 
                post={post} 
                userId={user.userId} 
                currentUser={currentUser}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;