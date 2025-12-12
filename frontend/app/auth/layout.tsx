import { AuthProvider } from "@/context/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md p-6 bg-background rounded-xl">
        <AuthProvider>{children}</AuthProvider>
      </div>
    </div>
  );
}
