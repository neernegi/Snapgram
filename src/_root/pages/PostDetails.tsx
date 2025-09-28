import { useParams, Link, useNavigate } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import { useDeletePost, usePostById, useUserPosts } from "@/hooks/usePost"; // Updated import path
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import GridPostList from "@/components/shared/GridPostList";
import { useUserContext } from "@/hooks/useUserContext";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  const { data: post, isLoading } = usePostById(id || "");
  const { data: userPosts, isLoading: isUserPostLoading } = useUserPosts(
    post?.userId || ""
  );
  const { mutate: deletePost } = useDeletePost();

  const relatedPosts = userPosts?.filter((userPost) => userPost.postId !== id);

  const handleDeletePost = () => {
    if (id) {
      deletePost(id);
      navigate(-1);
    }
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="hover:bg-slate-400"
        >
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          {post.images?.[0] && (
            <img
              src={post.images[0]}
              alt="Post content"
              className="w-full h-96 mb-1 rounded-lg object-cover"
            />
          )}

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post.user?.userId}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post.user?.profileImage ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-black">
                    {post.user?.displayName || post.user?.username}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post.postId}`}
                  className={`${user.userId !== post.userId && "hidden"}`}
                >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`post_details-delete_btn ${
                    user.userId !== post.userId && "hidden"
                  }`}
                >
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag:string, tagIndex:number) => (
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

            <div className="w-full">
              <PostStats post={post} userId={user.userId} currentUser={user} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} currentUser={user} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
