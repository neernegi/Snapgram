import {
  useFollowUser,
  useUnfollowUser,
  useCurrentUserFollowers,
  useCurrentUserFollowing
} from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";




const Follow = () => {
  const { user: currentUser } = useUserContext();
  const { data: users, isLoading } = useCurrentUserFollowers();
  const { data: followingData } = useCurrentUserFollowing();
  const { mutateAsync: followUser } = useFollowUser();
  const { mutateAsync: unfollowUser } = useUnfollowUser();

  // Initialize follow status based on current following data
  const [followStatus, setFollowStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (users && followingData) {
      const status: Record<string, boolean> = {};
      users.forEach((user) => {
        // Check if current user is following this user
        status[user.userId] = followingData.some(
          (followedUser) => followedUser.userId === user.userId
        );
      });
      setFollowStatus(status);
    }
  }, [users, followingData]);

  // Filter out current user from the list
  const filteredUsers = users?.filter((user) => user.userId !== currentUser.userId);

  const toggleFollow = async (targetUserId: string) => {
    try {
      const isFollowing = followStatus[targetUserId];
      
      if (isFollowing) {
        await unfollowUser(targetUserId);
      } else {
        await followUser(targetUserId);
      }

      // Update local state optimistically
      setFollowStatus(prev => ({
        ...prev,
        [targetUserId]: !isFollowing
      }));
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-4">
      {filteredUsers?.map((user) => (
        <div 
          key={user.userId}
          className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt={user.fullName}
              width={48}
              height={48}
              className="rounded-full w-12 h-12 object-cover"
            />
            <div>
              <h3 className="font-medium">{user.fullName}</h3>
              <p className="text-sm text-slate-500">@{user.username}</p>
            </div>
          </div>
          
          <Button
            variant={followStatus[user.userId] ? "outline" : "default"}
            onClick={() => toggleFollow(user.userId)}
            className="shad-button_primary px-5"
          >
            {followStatus[user.userId] ? "Following" : "Follow"}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Follow;