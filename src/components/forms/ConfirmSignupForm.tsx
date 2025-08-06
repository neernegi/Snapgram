import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
// import { useConfirmSignUp, useResendConfirmationCode } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { useConfirmSignUp, useResendConfirmationCode } from "@/hooks/useAuth";

const ConfirmSignupSchema = z.object({
  code: z.string().min(6, {
    message: "Verification code must be 6 characters.",
  }),
});

const ConfirmSignup = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username') || '';
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutateAsync: confirmSignUp, isPending: isConfirming } = useConfirmSignUp();
  const { mutateAsync: resendCode, isPending: isResending } = useResendConfirmationCode();

  const form = useForm<z.infer<typeof ConfirmSignupSchema>>({
    resolver: zodResolver(ConfirmSignupSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ConfirmSignupSchema>) {
    try {
      await confirmSignUp({
        username,
        code: values.code,
      });
    } catch (error) {
      toast({
        title: "Confirmation failed. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleResendCode = async () => {
    try {
      await resendCode(username);
    } catch (error) {
      toast({
        title: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex flex-col p-6 shadow-md">
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Confirm your account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Enter the verification code sent to your email
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {isConfirming ? (
              <div className="flex gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Confirm Account"
            )}
          </Button>

          <p className="text-small-regular text-dark-4 text-center mt-2">
            Didn't receive a code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-primary-500 text-small-semibold ml-1"
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default ConfirmSignup;