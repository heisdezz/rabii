import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { IconLock, IconMail, IconUser } from "@tabler/icons-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SimpleInput from "#/components/inputs/SimpleInput";
import { useIsLoading, useRegister } from "#/client/session";

export const Route = createFileRoute("/auth/sign-up")({
  component: RouteComponent,
});

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

type FormData = z.infer<typeof schema>;

function RouteComponent() {
  const register = useRegister();
  const isLoading = useIsLoading();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", passwordConfirm: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await register(data);
      toast.success("Account created!");
      navigate({ to: "/app" });
    } catch (e: any) {
      toast.error(e?.message ?? "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card bg-base-200 shadow ring fade w-full max-w-sm">
        <div className="card-body gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              <span className="text-primary">Rab</span>ii
            </h1>
            <p className="text-base-content/60 text-sm mt-1">
              Create your account
            </p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <SimpleInput
                {...form.register("name")}
                label="Name"
                type="text"
                placeholder="Your name"
                icon={<IconUser size={16} className="opacity-50" />}
              />
              <SimpleInput
                {...form.register("email")}
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<IconMail size={16} className="opacity-50" />}
              />
              <SimpleInput
                {...form.register("password")}
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<IconLock size={16} className="opacity-50" />}
              />
              <SimpleInput
                {...form.register("passwordConfirm")}
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                icon={<IconLock size={16} className="opacity-50" />}
              />

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading && <span className="loading loading-spinner loading-sm" />}
                Create account
              </button>
            </form>
          </FormProvider>

          <p className="text-center text-sm text-base-content/60">
            Already have an account?{" "}
            <Link to="/auth/login" className="link link-primary font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
