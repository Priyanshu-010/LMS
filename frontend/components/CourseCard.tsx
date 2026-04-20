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
      <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition cursor-pointer">
        <h2 className="text-xl font-bold mb-2 text-blue-600">
          {course.title}
        </h2>

        <p className="text-gray-600 line-clamp-3">
          {course.description}
        </p>
      </div>
    </Link>
  );
}