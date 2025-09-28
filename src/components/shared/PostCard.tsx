import { useUserContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { multiFormatDateString } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAddComment, usePostById, useDeleteComment } from "@/hooks/usePost";
import { Input } from "../ui/input";
import Loader from "./Loader";
import { Separator } from "../ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { CommentItem, PostCardProps } from "@/types/interfaces";



const PostCard = ({ post, currentUser }: PostCardProps) => {
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: commentMutation, isPending: isCommentPending } =
    useAddComment();
  const { mutate: deleteCommentMutation } = useDeleteComment();
  const { data: updatedPost, isLoading: isLoadingPost } = usePostById(
    post.postId
  );

  const currentPost = updatedPost || post;
  const commentsToRender = currentPost.comments || [];

  useEffect(() => {
    if (!isCommentPending && !isSubmitting) {
      setComment("");
    }
  }, [isCommentPending, isSubmitting]);

  const commentHandle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim() === "" || isSubmitting || isCommentPending) return;

    setIsSubmitting(true);

    try {
      await commentMutation({
        postId: post.postId,
        text: comment.trim(),
        createdAt: new Date(),
      });

      await queryClient.invalidateQueries({
        queryKey: ["post", post.postId],
      });

      setComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (!commentId) return;

    deleteCommentMutation(
      { postId: post.postId, commentId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["post", post.postId],
          });
        },
        onError: (error) => {
          console.error("Error deleting comment:", error);
        },
      }
    );
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSubmitting && !isCommentPending) {
      setComment(e.target.value);
    }
  };

  const showCommentHandler = () => {
    setShowComment((prevCount) => prevCount + 3);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commentHandle(e as any);
    }
  };

  const canDeleteComment = (commentOwnerId: string) => {
    return user.userId === commentOwnerId || user.userId === post.userId;
  };

  if (!post?.user) return null;

  return (
    <>
      <div className="post-card">
        <div className="flex-between">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.user.userId}`} key={post.postId}>
              <img
                src={
                  post.user.profileImage ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="creator"
                className="rounded-full w-12 lg:h-12"
              />
            </Link>
            <div className="flex flex-col">
              <p className="base-medium lg:body-bold">
                {post.user.displayName || post.user.username}
              </p>
              <div className="flex-center gap-2 text-gray-600">
                <p className="subtle-semibold lg:small-regular">
                  {multiFormatDateString(post.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <Link
            to={`/update-post/${post.postId}`}
            className={`${user.userId !== post.userId && "hidden"}`}
          >
            <img src={"/assets/icons/edit.svg"} alt="edit" width={20} />
          </Link>
        </div>

        <Link to={`/posts/${post.postId}`}>
          <div className="small-medium lg:base-medium py-5">
            <p>{post.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-200 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </ul>
          </div>
          {post.images?.[0] && (
            <img
              src={post.images[0]}
              alt="Post content"
              className="w-full h-96 mb-1 rounded-lg object-cover"
            />
          )}
        </Link>

        <PostStats
          post={currentPost}
          userId={user.userId}
          currentUser={currentUser}
        />
      </div>

      <Separator className="my-5 lg:w-auto bg-slate-400" />

      <div className="flex gap-3 mb-4">
        <img
          src={
            currentUser?.profileImage || "/assets/icons/profile-placeholder.svg"
          }
          width={44}
          alt="user"
          className="rounded-full h-10"
        />
        <Input
          type="text"
          value={comment}
          onChange={handleCommentChange}
          onKeyPress={handleKeyPress}
          placeholder={
            isSubmitting || isCommentPending
              ? "Posting comment..."
              : "Write a comment"
          }
          className="bg-gray-200 -mr-12"
          disabled={isSubmitting || isCommentPending}
        />
        <div>
          {isSubmitting || isCommentPending ? (
            <Loader />
          ) : (
            <img
              src="/assets/icons/send-message.png"
              width={25}
              alt="send"
              onClick={commentHandle}
              className="mr-7 mt-2 cursor-pointer hover:opacity-70"
            />
          )}
        </div>
      </div>

      <div className="mb-7">
        {isLoadingPost ? (
          <Loader />
        ) : commentsToRender.length === 0 ? (
          <h1 className="text-black">No comments</h1>
        ) : (
          <>
            {commentsToRender
              .slice(0, showComment)
              .map((commentItem: CommentItem) => (
                <div
                  key={commentItem.commentId}
                  className="flex gap-3 mb-5 group relative"
                >
                  <img
                    src={
                      commentItem.owner?.profileImage ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="commenter"
                    width={48}
                    className="rounded-full h-12"
                  />
                  <div className="bg-slate-200 p-3 rounded-lg w-full">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {commentItem.owner?.username || "Unknown User"}
                      </h3>
                      <p className="text-zinc-700 text-sm">
                        {multiFormatDateString(
                          typeof commentItem.createdAt === "string"
                            ? commentItem.createdAt
                            : commentItem.createdAt.toISOString()
                        )}
                      </p>
                      {canDeleteComment(commentItem.owner.userId) && (
                        <button
                          onClick={() =>
                            handleDeleteComment(commentItem.commentId)
                          }
                          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                          aria-label="Delete comment"
                          title="Delete comment"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="mt-1">{commentItem.text}</p>
                  </div>
                </div>
              ))}

            {showComment < commentsToRender.length && (
              <button
                onClick={showCommentHandler}
                className="ml-14 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View more comments ({commentsToRender.length - showComment}{" "}
                more)
              </button>
            )}
          </>
        )}
        <Separator className="my-4 lg:w-auto bg-slate-400" />
      </div>
    </>
  );
};

export default PostCard;
