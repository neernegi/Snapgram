import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { ProfileValidation } from "@/lib/schema";
import Loader from "@/components/shared/Loader";
import ProfileUploader from "@/components/shared/ProfileUploader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUpdateProfile } from "@/hooks/useAuth";
import { convertFileToBase64 } from "@/lib/utils";
import { ProfileUser } from "@/types/interfaces";
import { useUserContext } from "@/hooks/useUserContext";

type UpdateProfileProps = {
  profileUser?: ProfileUser;
  isLoading?: boolean;
};

const UpdateProfile = ({ profileUser, isLoading }: UpdateProfileProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: "",
      name: "",
      username: "",
      email: "",
      bio: "",
    },
  });

  const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
    useUpdateProfile();

  const currentUser = useMemo(() => {
    return (
      profileUser || {
        userId: user.userId,
        username: user.username,
        fullName: user.name,
        email: user.email,
        bio: user.bio,
        profileImage: user.imageUrl,
      }
    );
  }, [profileUser, user]);

  useEffect(() => {
    if (currentUser?.userId && !form.formState.isDirty) {
      form.reset({
        file: currentUser.profileImage,
        name: currentUser.fullName,
        username: currentUser.username,
        email: currentUser.email,
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser, form, form.formState.isDirty]);

  if (isLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    try {
      console.log("Form values:", value);

      // Start with basic update data - no image first
      const updateData: any = {
        fullName: value.name,
        bio: value.bio,
      };

      console.log("Basic update data:", updateData);

      // Only handle image if there's actually a new file selected
      if (value.file && Array.isArray(value.file) && value.file.length > 0) {
        const file = value.file[0];
        console.log("File selected:", {
          name: file.name,
          size: file.size,
          type: file.type,
        });

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload an image smaller than 5MB",
            variant: "destructive",
          });
          return;
        }

        // Validate file type
        if (!file.type.match(/image\/(jpeg|png|jpg|gif)/)) {
          toast({
            title: "Invalid file type",
            description: "Please upload a JPEG, PNG, or GIF image",
            variant: "destructive",
          });
          return;
        }

        try {
          console.log("Converting file to base64...");
          // Convert file to base64 - pass the single file, not an array
          const base64String = await convertFileToBase64(file);
          console.log(
            "Base64 conversion successful, length:",
            base64String?.length
          );

          updateData.imageData = {
            base64: base64String,
            mimeType: file.type,
          };
          console.log("Image data added to update payload");
        } catch (error) {
          console.error("Error converting file to base64:", error);
          toast({
            title: "Image upload failed",
            description: "Could not process the image",
            variant: "destructive",
          });
          return;
        }
      } else {
        console.log("No new file selected, skipping image update");
      }

      console.log(
        "Final update data being sent:",
        JSON.stringify(updateData, null, 2)
      );

      const updatedUser = await updateUser(updateData);

      setUser({
        ...user,
        name: updatedUser.fullName || value.name,
        bio: updatedUser.bio || value.bio,
        imageUrl: updatedUser.profileImage || currentUser.profileImage,
      });

      toast({
        title: "Profile updated successfully!",
      });

      navigate(`/profile/${id}`);
    } catch (error) {
      console.error("Error updating profile:", error);

      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      toast({
        title: "Update failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  // Test function to update profile without image first
  const handleBasicUpdate = async () => {
    try {
      console.log("Testing basic update without image...");
      const basicData = {
        fullName: form.getValues("name") || "Test Name",
        bio: form.getValues("bio") || "Test Bio",
      };

      console.log("Basic test data:", basicData);
      const result = await updateUser(basicData);
      console.log("Basic update result:", result);

      toast({
        title: "Basic update successful!",
      });
    } catch (error) {
      console.error("Basic update failed:", error);
      toast({
        title: "Basic update failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.profileImage || ""}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">
                    Display Name
                  </FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>

              {/* Debug button - remove this after fixing the issue */}
              <Button
                type="button"
                className="bg-yellow-500 hover:bg-yellow-600"
                onClick={handleBasicUpdate}
              >
                Test Basic Update
              </Button>

              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}
              >
                {isLoadingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
