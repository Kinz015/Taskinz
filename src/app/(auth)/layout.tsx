export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{
        background: `
      radial-gradient(circle at 20% 30%, rgba(34,197,94,0.25), transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(59,130,246,0.25), transparent 40%),
      #020617
    `,
      }}
    >
      {children}
    </main>
  );
}
