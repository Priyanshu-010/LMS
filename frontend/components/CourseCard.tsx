import Link from "next/link";

type Course = {
  id: number;
  title: string;
  description: string;
};

export default function CourseCard({
  course,
}: {
  course: Course;
}) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="group bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-zinc-900 transition-all duration-300 cursor-pointer shadow-xl">
        <div className="mb-4 h-1 w-12 bg-blue-600 rounded-full group-hover:w-20 transition-all duration-300"></div>
        
        <h2 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
          {course.title}
        </h2>

        <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
          {course.description}
        </p>
        
        <div className="mt-6 flex items-center text-xs font-bold text-blue-500 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
          View Course Content →
        </div>
      </div>
    </Link>
  );
}