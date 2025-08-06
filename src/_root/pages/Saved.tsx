import Loader from "@/components/shared/Loader";
import { useSavedPosts, useUnsavePost } from "@/hooks/usePost";

import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const Saved = () => {

  const { data: savedPosts, isLoading, isError } = useSavedPosts();
  const { mutate: unsavePost } = useUnsavePost();

  const handleUnsave = (postId: string) => {
    unsavePost(postId);
  };

  if (isLoading) {
    return (
      <div className="flex-center h-full w-full">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-center h-full w-full">
        <div className="text-center p-8 rounded-lg bg-gray-3 max-w-md">
          <img
            src="/assets/icons/error.svg"
            width={48}
            height={48}
            alt="error"
            className="mx-auto mb-4 invert-white"
          />
          <h3 className="h3-bold text-light-1 mb-2">Failed to load</h3>
          <p className="text-light-4">Couldn't fetch your saved posts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="common-container">
      <div className="flex-start w-full max-w-5xl gap-3 mb-8">
        <div className="p-2 rounded-full bg-slate-700">
          <img
            src="/assets/icons/save.svg"
            width={28}
            height={28}
            alt="save"
            className="invert-white"
          />
        </div>
        <div>
          <h2 className="h2-bold text-black-1">Saved Posts</h2>
          <p className="text-black-3">Your collection of favorite moments</p>
        </div>
      </div>

      {!savedPosts || savedPosts.length === 0 ? (
        <div className="flex-center flex-col gap-4 h-96 w-full rounded-xl bg-slate-500">
          <img
            src="/assets/icons/save.svg"
            width={64}
            height={64}
            alt="save"
            className="invert-white opacity-50"
          />
          <h3 className="h3-bold text-light-2">No saved posts yet</h3>
          <p className="text-light-4 max-w-md text-center">
            Save posts you love by clicking the bookmark icon on any post.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {savedPosts.map((post) => (
            <div
              key={post.postId}
              className="relative bg-slate-400 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-200 flex flex-col"
            >
              {/* Image if exists */}
              {post.images?.[0] && (
                <img
                  src={post.images[0]}
                  alt="Post"
                  className="w-full h-56 object-cover"
                />
              )}

              {/* Main content */}
              <div className="flex flex-col p-4 flex-1">
                {/* User info */}
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={post.owner.profileImage || "/assets/icons/profile-placeholder.svg"}
                    alt={post.owner.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-dark-1 h4-bold font-medium">{post.owner.fullName}</h3>
                    <p className="text-dark-3 text-xs">
                      {formatDistanceToNow(new Date(post.savedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {/* Caption if exists */}
                {post.caption && (
                  <p className="text-light-1 mb-2 line-clamp-3">{post.caption}</p>
                )}

                {/* Tags if exists */}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.map((tag:string) => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-600 text-light-2 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Spacer to push Unsave to bottom */}
                <div className="flex-1" />

                {/* Unsave button */}
                <Button
                  onClick={() => handleUnsave(post.postId)}
                  variant="outline"
                  className="mt-3 w-full bg-dark-4 hover:bg-dark-2 text-light-1 border-none"
                  size="sm"
                >
                  <img
                    src="/assets/icons/saved.svg"
                    width={16}
                    height={16}
                    alt="unsave"
                    className="invert-white mr-2"
                  />
                  Unsave
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
