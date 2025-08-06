import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// import { checkIsLiked } from "@/lib/utils";

import {
  useToggleLike,
  useUnlikePost,
  useSavePost,
  useUnsavePost,
} from "@/hooks/usePost";

type PostStatsProps = {
  post: {
    postId: string;
    likes?: { userId: string; createdAt: string }[];
  };
  userId: string;
  currentUser?: {
    userId: string;
    savedPosts?: string[];
  };
};
const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};
const PostStats = ({ post, userId, currentUser }: PostStatsProps) => {
  const location = useLocation();

  // ✅ Fix: Use optional chaining and fallback to empty array
  const likesList = post?.likes?.map((like) => like.userId) ?? [];
  console.log("like lisssttt----", likesList);
  console.log("post likesss   ----",post.likes)

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useToggleLike();
  const { mutate: unlikePost } = useUnlikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: unsavePost } = useUnsavePost();

  const isPostSaved = currentUser?.savedPosts?.includes(post.postId);

useEffect(() => {
  const likesList = post?.likes?.map((like) => like.userId) ?? [];
  setLikes(likesList);
}, [post.likes]);

useEffect(() => {
  setIsSaved(!!isPostSaved);
}, [isPostSaved]);


  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    const isLiked = likes.includes(userId);
    let likesArray = [...likes];

    if (isLiked) {
      likesArray = likesArray.filter((id) => id !== userId);
      setLikes(likesArray);
      unlikePost(post.postId);
    } else {
      likesArray.push(userId);
      setLikes(likesArray);
      likePost(post.postId);
    }
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (isSaved) {
      setIsSaved(false);
      unsavePost(post.postId);
    } else {
      setIsSaved(true);
      savePost(post.postId);
    }
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="save"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleSavePost}
        />
      </div>
    </div>
  );
};

export default PostStats;
