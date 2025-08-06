import * as z from "zod";


export const usernameSchema = z.string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be less than 20 characters")
  .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers and underscores allowed")
// .refine(async (username) => {
//   const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
//   const { available } = await response.json();
//   return available;
// }, "Username is already taken")

export const SignupValidationSchema = z.object({
  username: usernameSchema,
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
});



export const SignInValidationSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

// Post validation schema
export const PostValidation = z.object({
  caption: z
    .string()
    .min(1, "Caption is required")
    .max(2200, "Caption cannot exceed 2200 characters"),
  file: z.any().optional(),
  tags: z.string().optional(),
});


export const ProfileValidation = z.object({
  file: z.any().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});
