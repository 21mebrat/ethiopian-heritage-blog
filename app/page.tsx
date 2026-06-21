export default function Home({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-[url('/fouth.jpeg')] bg-cover bg-center bg-no-repeat">

      {/* overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
      {children}
      </div>

    </div>
  );
}