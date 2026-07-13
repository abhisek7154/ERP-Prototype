import { notFound } from "next/navigation";
import { getStudentById } from "~/modules/student";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const student = await getStudentById(id);

  if (!student) {
    notFound();
  }

  return (
  <div className="space-y-6">
    <Button asChild variant="outline">
      <Link href="/dashboard/people/students">
        ← Back
      </Link>
    </Button>

    <div>
      <h1 className="text-3xl font-bold">Student Details</h1>
      <p className="text-muted-foreground">
        View complete student information.
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Registration Number
          </p>
          <p className="font-medium">
            {student.registrationNumber}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Student Name
          </p>
          <p className="font-medium">
            {student.name}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Father's Name
          </p>
          <p className="font-medium">
            {student.fatherName ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Course
          </p>
          <p className="font-medium">
            {student.course ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Status
          </p>

          <Badge>
            {student.status}
          </Badge>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Date of Birth
          </p>

          <p className="font-medium">
            {student.dateOfBirth
              ? student.dateOfBirth.toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Admission Date
          </p>

          <p className="font-medium">
            {student.dateOfAdmission
              ? student.dateOfAdmission.toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Created At
          </p>

          <p className="font-medium">
            {student.createdAt.toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Updated At
          </p>

          <p className="font-medium">
            {student.updatedAt.toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>

    <Button>
      Edit Student
    </Button>
  </div>
);
}