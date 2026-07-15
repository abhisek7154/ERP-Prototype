import { getStudents } from "~/modules/student";

import { StudentTable } from "./_components/StudentTable";
import { StudentToolbar } from "./_components/StudentToolbar";

interface StudentsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  const { search = "" , page = "1"} = await searchParams;

  const currentPage = Math.max(1 , Number(page) || 1)

  const result = await getStudents({
    page: Number(page),
    search,
  });

  return (
    <div className="space-y-6 p-6">
      <StudentToolbar currentSearch={search} />

      <StudentTable 
        students={result.students} 
        currentPage={result.currentPage}
        totalPages={result.totalPages}
      />
    </div>
  );
}