import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { IconLock, IconMail } from "@tabler/icons-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SimpleInput from "#/components/inputs/SimpleInput";
import { useIsLoading, useLogin } from "#/client/session";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

function RouteComponent() {
  const login = useLogin();
  const isLoading = useIsLoading();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      navigate({ to: "/app" });
    } catch (e: any) {
      toast.error(e?.message ?? "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card bg-base-200 shadow ring fade w-full max-w-xl">
        <div className="card-body gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              <span className="text-primary">Rab</span>ii
            </h1>
            <p className="text-base-content/60 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading && (
                  <span className="loading loading-spinner loading-sm" />
                )}
                Sign in
              </button>
            </form>
          </FormProvider>

          <p className="text-center text-sm text-base-content/60">
            Don't have an account?{" "}
            <Link to="/auth/sign-up" className="link link-primary font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
