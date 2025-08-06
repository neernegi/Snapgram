import { useState } from "react";
import {
  Heart,
  Bookmark,
  Grid3X3,
  Calendar,
  ExternalLink,
  Camera,
  Trash2,
  Edit3,

} from "lucide-react";
import { useUserContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";

// Mock hook for demonstration - replace with your actual hook
const useDeletePost = () => {
  return {
    mutate: (postId: string) => {
      console.log("Deleting post:", postId);
      // Your actual delete logic here
    },
    isLoading: false,
  };
};

// Type Definitions
interface Like {
  userId: string;
  createdAt?: string;
}

interface Comment {
  userId: string;
  text: string;
  createdAt?: string;
  commentId?: string;
  user?: {
    username: string;
    profileImage?: string;
  };
}

interface Post {
  postId: string;
  caption: string;
  images: string[];
  tags: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt?: string;
  likes?: Like[];
  comments?: Comment[];
  owner?: {
    userId: string;
    username: string;
    fullName: string;
    profileImage: string;
  };
}

interface SavedPost extends Post {
  savedAt: string;
  savedAtFormatted: string;
  owner: {
    userId: string;
    username: string;
    fullName: string;
    profileImage: string;
  };
}

interface LikedPost extends Post {
  likedAt: string;
  likedAtFormatted: string;
  owner: {
    userId: string;
    username: string;
    fullName: string;
    profileImage: string;
  };
}




const ProfilePage = () => {
  // Mock data for demonstration

  const { userProfile, user } = useUserContext();

  const [activeTab, setActiveTab] = useState<"posts" | "liked" | "saved">(
    "posts"
  );
  
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const deletePost = useDeletePost();

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "posts",
      label: "Posts",
      icon: Grid3X3,
      count: userProfile.postCount,
    },
    {
      id: "liked",
      label: "Liked",
      icon: Heart,
      count: userProfile.likedPosts?.length || 0,
    },
    {
      id: "saved",
      label: "Saved",
      icon: Bookmark,
      count: userProfile.savedPosts?.length || 0,
    },
  ];

  const handleDeletePost = (postId: string) => {
    deletePost.mutate(postId);
    setShowDeleteModal(null);
  };

  const renderPosts = (posts: Post[] | LikedPost[] | SavedPost[]) => {
    if (!posts || posts.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center  text-gray-500">
          <Camera className="w-20 h-20 mb-6 text-gray-300" />
          <p className="text-xl font-medium mb-2">No posts yet</p>
          <p className="text-gray-400">
            Share your first moment to get started!
          </p>
        </div>
      );
    }

    return posts.map((post, index) => (
      <div
        key={post.postId || index}
        className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      >
        {/* Post Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 p-0.5">
              <img
                src={
                  post.owner?.profileImage ||
                  userProfile?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    post.owner?.username ||
                      post.owner?.fullName ||
                      userProfile?.username ||
                      "User"
                  )}&background=6366f1&color=fff&size=48`
                }
                alt={post.owner?.username || userProfile?.username}
                className="w-full h-full rounded-full object-cover bg-white"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {post.owner?.username ||
                  userProfile?.username ||
                  "Unknown User"}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Delete button for own posts */}
          {activeTab === "posts" && (
            <div className="relative">
              <button
                onClick={() => setShowDeleteModal(post.postId)}
                className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="px-6 space-y-4">
          {post.caption && (
            <p className="text-gray-800 leading-relaxed">{post.caption}</p>
          )}

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
        </div>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="mt-4 overflow-hidden">
            {post.images.length === 1 ? (
              <img
                src={post.images[0]}
                alt="Post image"
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {post.images.slice(0, 4).map((image, imgIndex) => (
                  <div key={imgIndex} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Post image ${imgIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {imgIndex === 3 && post.images.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          +{post.images.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Post Footer */}
        <div className="p-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Heart className="w-5 h-5" />
                <span className="font-medium">{post.likesCount}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="font-medium">
                  {post.commentsCount} comments
                </span>
              </div>
            </div>
            <Bookmark className="w-5 h-5 text-gray-400 hover:text-purple-500 cursor-pointer transition-colors" />
          </div>

          {/* Timestamp for liked/saved posts */}
          {"likedAtFormatted" in post && (
            <div className="text-sm text-purple-600 mt-3 pt-3 border-t border-gray-100">
              💜 Liked {post.likedAtFormatted}
            </div>
          )}
          {"savedAtFormatted" in post && (
            <div className="text-sm text-blue-600 mt-3 pt-3 border-t border-gray-100">
              🔖 Saved {post.savedAtFormatted}
            </div>
          )}
        </div>
      </div>
    ));
  };

  const getActiveContent = () => {
    switch (activeTab) {
      case "posts":
        return renderPosts(userProfile.posts);
      case "liked":
        return renderPosts(userProfile.likedPosts);
      case "saved":
        return renderPosts(userProfile.savedPosts);
      default:
        return renderPosts(userProfile.posts);
    }
  };

  return (
    <div
      style={{ width: "100%" }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Profile Header */}
        <div
          
          className="bg-white max-w-4xl rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="relative">
              <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-1">
                <img
                  src={
                    userProfile.profileImage ||
                    user?.imageUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userProfile.fullName || userProfile.username
                    )}&background=6366f1&color=fff&size=160`
                  }
                  //   alt={userProfile.fullName || userProfile.username}
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full w-10 h-10 border-4 border-white flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4">
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-3">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                    {userProfile.fullName || userProfile.username}
                  </h1>
                  <Link to={`/update-profile/${userProfile?.userId}`}>
                    <button
                    
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  </Link>
                </div>
                <p className="text-gray-600 text-xl">@{userProfile.username}</p>
              </div>

              {userProfile.bio && (
                <p className="text-gray-700 mb-4 max-w-2xl leading-relaxed text-lg">
                  {userProfile.bio}
                </p>
              )}

              <div className="flex justify-center lg:justify-start space-x-12 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {userProfile.postCount}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {userProfile.followerCount}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Followers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {userProfile.followingCount}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Following
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span>Joined {userProfile.createdAtFormatted}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-5 h-5 text-purple-500" />
                  <a
                    href={`mailto:${userProfile.email}`}
                    className="hover:text-purple-600 transition-colors"
                  >
                    {userProfile.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-100">
            <div className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(tab.id as "posts" | "liked" | "saved")
                    }
                    className={`flex items-center justify-center space-x-3 py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:scale-102"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-base">{tab.label}</span>
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-bold ${
                        activeTab === tab.id
                          ? "bg-white/25 text-white"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {getActiveContent()}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-300 rounded-3xl p-8 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Delete Post
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-6 py-3 border bg-white border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(showDeleteModal)}
                  className="flex-1 px-6 bg-slate-700 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
