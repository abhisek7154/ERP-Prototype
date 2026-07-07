import { getStudents } from "~/modules/student";

import { StudentTable } from "./_components/StudentTable";
import { StudentToolbar } from "./_components/StudentToolbar";

interface StudentsPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  const { search = "" } = await searchParams;

  const students = await getStudents(search);

  return (
    <div className="space-y-6 p-6">
      <StudentToolbar currentSearch={search} />

      <StudentTable students={students} />
    </div>
  );
}