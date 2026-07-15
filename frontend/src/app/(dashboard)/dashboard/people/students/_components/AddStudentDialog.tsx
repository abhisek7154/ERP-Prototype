"use client";

import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [course, setCourse] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Student</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Enter the student's information to register them in the ERP.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4 py-4"
          onSubmit={async (e) => {
                  e.preventDefault();

                  try {
                    setLoading(true);

                    const response = await fetch("/api/students", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        registrationNumber,
                        name,
                        fatherName,
                        course,
                        dateOfBirth,
                        dateOfAdmission,
                        status,
                      }),
                    });

                    const result = await response.json();

                    if (!response.ok) {
                      throw new Error(result.message);
                    }

                    // Reset form
                    setRegistrationNumber("");
                    setName("");
                    setFatherName("");
                    setCourse("");
                    setDateOfBirth("");
                    setDateOfAdmission("");
                    setStatus("ACTIVE");

                    // Close dialog
                    setOpen(false);

                    // Refresh student list
                    window.location.reload();
                  } catch (error) {
                    alert(
                      error instanceof Error
                        ? error.message
                        : "Failed to create student."
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
                >
          <div className="grid gap-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="Enter registration number"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fatherName">Father's Name</Label>
            <Input
              id="fatherName"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder="Enter father's name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Enter course"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateOfAdmission">Admission Date</Label>
            <Input
              id="dateOfAdmission"
              type="date"
              value={dateOfAdmission}
              onChange={(e) => setDateOfAdmission(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}