import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import {
  useFollowUser,
  useUnfollowUser,
  useGetAllUsers,
  useGetCurrentUserFollowing,
} from "@/hooks/useAuth";
import { useUserContext } from "@/hooks/useUserContext";

const UserCard = ({ compact = false }: { compact?: boolean }) => {
  const { user: currentUser } = useUserContext();
  const { data: allUsers = [], isLoading } = useGetAllUsers();
  const {
    data: currentUserFollowing = [],
    isLoading: isFollowingLoading,
    refetch: refetchFollowing,
  } = useGetCurrentUserFollowing();

  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();

  const [followingUserIds, setFollowingUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const followingSet = new Set(currentUserFollowing?.map((user) => user.userId));
    setFollowingUserIds(followingSet);
  }, [currentUserFollowing]);

  if (isLoading || isFollowingLoading) {
    return (
      <div className="flex-center h-40">
        <Loader />
      </div>
    );
  }

  const filteredUsers = allUsers.filter(
    (user) => user.userId !== currentUser?.userId
  );

  const handleFollowAction = (userId: string, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowUser(userId, {
        onSuccess: () => {
          setFollowingUserIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
          refetchFollowing();
        },
      });
    } else {
      followUser(userId, {
        onSuccess: () => {
          setFollowingUserIds((prev) => {
            const newSet = new Set(prev);
            newSet.add(userId);
            return newSet;
          });
          refetchFollowing();
        },
      });
    }
  };

  const renderUserCard = (user: any) => {
    const isFollowing = followingUserIds.has(user.userId);

    return (
      <div
        key={user.userId}
        className="flex flex-col p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-700 hover:border-primary-500/30 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <div className="flex items-start gap-4">
          <Link to={`/profile/${user.userId}`} className="flex-shrink-0">
            <img
              src={
                user.profileImage || "/assets/icons/profile-placeholder.svg"
              }
              alt={user.username}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary-500/80"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/icons/profile-placeholder.svg";
              }}
            />
          </Link>

          <div className="flex-1 min-w-0 space-y-1">
            <Link to={`/profile/${user.userId}`} className="block">
              <p className="body-bold text-white hover:text-primary-400 transition-colors">
                {user.fullName || user.username}
              </p>
              <p className="small-regular text-gray-400">@{user.username}</p>
            </Link>

            <div className="flex gap-4 mt-2">
              <p className="small-regular text-gray-400">
                <span className="text-white font-semibold">
                  {user.followerCount || 0}
                </span>{" "}
                Followers
              </p>
              <p className="small-regular text-gray-400">
                <span className="text-white font-semibold">
                  {user.followingCount || 0}
                </span>{" "}
                Following
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => handleFollowAction(user.userId, isFollowing)}
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            className={`rounded-full px-6 transition-all ${
              isFollowing
                ? "border-primary-500 text-primary-500 hover:bg-primary-500/10 hover:text-primary-400"
                : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </div>
    );
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-5">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3">
            Connect With Creators
          </h1>
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-light-3">No users to display</p>
        ) : (
          <div className="space-y-4">
            {filteredUsers.slice(0, 3).map(renderUserCard)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3">
          Connect With Creators
        </h1>
        <p className="text-light-3 max-w-2xl mx-auto">
          Discover amazing people, follow your interests, and build your
          community
        </p>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex-center h-40">
          <p className="text-light-3">No users to display</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(renderUserCard)}
        </div>
      )}
    </div>
  );
};

export default UserCard;
