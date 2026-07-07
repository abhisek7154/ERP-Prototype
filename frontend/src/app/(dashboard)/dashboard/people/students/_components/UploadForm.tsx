"use client";

import { useRef, useState } from "react";

import { Loader2, FileSpreadsheet } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { ImportSummary } from "./ImportSummary";

type ImportResult = {
  totalRows: number;
  importedRows: number;
  failedRows: number;
  errors: {
    row: number;
    errors: string[];
  }[];
};

type UploadFormProps = {
  onSuccess?: () => void;
};

export function UploadForm({ onSuccess }: UploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<ImportResult | null>(null);

  async function handleImport() {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      // Change this if your API is different
      formData.append("schoolId", process.env.NEXT_PUBLIC_SCHOOL_ID ?? "");

      const response = await fetch("/api/import/students", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message);
      }

      setResult(json.data);
    } catch (error) {
      console.error(error);
      alert("Import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <Input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        onChange={(e) => {
          if (e.target.files?.length) {
            setFile(e.target.files[0]);
          }
        }}
      />

      {file && (
        <div className="flex items-center gap-2 rounded-md border p-3">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />

          <div className="flex-1">
            <p className="font-medium">{file.name}</p>

            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      )}

      <Button
        disabled={!file || loading}
        onClick={handleImport}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Importing...
          </>
        ) : (
          "Import Students"
        )}
      </Button>

      {result && (
        <ImportSummary
          result={result}
        />
      )}
    </div>
  );
}