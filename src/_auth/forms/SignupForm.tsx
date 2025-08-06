import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SignupValidationSchema } from "@/lib/schema";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSignUp } from "@/hooks/useAuth";

const SignupForm = () => {
  const { mutateAsync: signUp, isPending } = useSignUp();

  const form = useForm<z.infer<typeof SignupValidationSchema>>({
    resolver: zodResolver(SignupValidationSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignupValidationSchema>) => {
    try {
      await signUp(values);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <Form {...form}>
      <div
        className="sm:w-420 flex flex-col p-6"
        style={{ boxShadow: "2px 2px 4px 1px rgba(0, 0, 0, 0.2)" }}
      >
        <Link to="/" className="flex gap-3 items-center justify-center mb-3">
          <img
            src="/assets/images/logoSVG.svg"
            alt="logo"
            width={170}
            height={36}
          />
          <h3
            style={{
              marginLeft: "-8.5rem",
              fontSize: "1.6rem",
              fontWeight: "bold",
            }}
          >
            DevGram
          </h3>
        </Link>

        <h1 className="text-2xl font-bold self-center">Create a new account</h1>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use DevGram enter your account details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="fullName" // ✅ Corrected this line
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
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
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="yourusername" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <div className="flex gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <p className="text-small-regular text-dark-4 text-center mt-2">
            Already have an account?{" "}
            <Link
              to={"/sign-in"}
              className="text-sky-900 text-small-semibold ml-1"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
