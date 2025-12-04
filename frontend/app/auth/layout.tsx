import { AuthProvider } from "@/context/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh_-_104px)] items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm">
        <AuthProvider>{children}</AuthProvider>
      </div>
    </div>
  );
}
