export default function HomePage() {
  return (
    <div className="text-center mt-32 max-w-3xl mx-auto">
      <h1 className="text-6xl font-extrabold mb-6 bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
        Welcome to LMS
      </h1>

      <p className="text-xl text-zinc-400 leading-relaxed font-light">
        The modern way to learn. Master new skills through high-quality video courses and curated PDF resources.
      </p>

      <div className="mt-10 flex gap-4 justify-center">
        <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
      </div>
    </div>
  );
}