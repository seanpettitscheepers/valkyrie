import { ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  files: FileList | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUpload({ files, onFileChange }: FileUploadProps) {
  return (
    <div className="space-y-4">
      <Label>Upload Images or Videos</Label>
      <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
        <div className="flex justify-center">
          <ImagePlus className="h-12 w-12 text-muted-foreground" />
        </div>
        <div>
          <Label
            htmlFor="file-upload"
            className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80"
          >
            <span>Upload files</span>
            <Input
              id="file-upload"
              type="file"
              className="sr-only"
              accept="image/*,video/*"
              multiple
              onChange={onFileChange}
            />
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            or drag and drop your files here
          </p>
        </div>
        {files && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {files.length} file(s) selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}