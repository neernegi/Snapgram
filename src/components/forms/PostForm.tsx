import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { PostValidation } from "@/lib/schema";
import { useToast } from "@/components/ui/use-toast";

import { useCreatePost, useUpdatePost } from "@/hooks/usePost";
import { convertFilesToBase64, validateFiles } from "@/lib/utils";
import FileUploader from "../shared/FileUploader";
import Loader from "../shared/Loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type PostFormProps = {
  post?: {
    postId: string;
    caption: string;
    images: string[];

    tags: string[];
  };
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();


  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post.caption : "",
      file: [],
      tags: post ? post.tags.join(",") : "",
    },
  });

  // Hooks
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    try {
      // ACTION = UPDATE (only caption can be updated, no image changes)
      if (post && action === "Update") {
        await updatePost({
          postId: post.postId,
          data: {
            caption: value.caption,
          },
        });

        toast({ title: "Post updated successfully!" });
        return navigate(`/posts/${post.postId}`);
      }

     

      const { valid: validFiles } = validateFiles(value.file);

      if (validFiles.length > 2) {
        toast({
          title: "Too many images",
          description: "Maximum 2 images allowed per post",
          variant: "destructive",
        });
        return;
      }

      // Convert files to base64
      const imagesData = await convertFilesToBase64(validFiles);

      // Create post data
      const postData: any = {
        caption: value.caption,
        images: imagesData,
      };

      if (value.tags && value.tags.trim()) {
        postData.tags = value.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }

      await createPost(postData);

      toast({ title: "Post created successfully!" });
      navigate("/");
    } catch (error: any) {
      console.error(`${action} post error:`, error);
      toast({
        title: `${action} post failed`,
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  placeholder="Write a caption..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Photos{" "}
                {action === "Create" && <span className="text-red-500">*</span>}
              </FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrls={post?.images}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
              {action === "Update" && (
                <p className="text-sm text-gray-500">
                  Note: Images cannot be changed when updating a post
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
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
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
