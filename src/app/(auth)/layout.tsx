export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#1f1f1f] flex items-center justify-center ">
      {children}
    </main>
  );
}