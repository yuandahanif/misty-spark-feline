import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileWithPreview } from "@/types/FileWithPreview";


type Props = {
  onSubmit?: (files: FileWithPreview) => void;
};

export default function CreateForm({ onSubmit }: Props) {
  const [files, setFiles] = useState<FileWithPreview>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDropAccepted(files) {
      setFiles(
        files.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const removeFile = (file: (typeof files)[number]) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
    URL.revokeObjectURL(file.preview);
  };

  const removeAllFiles = () => {
    setFiles([]);
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  };

  const thumbs = files.map((file) => (
    <button
      type="button"
      className="relative flex justify-center overflow-hidden items-center rounded-xs border w-48 h-48 p-1 box-border"
      key={file.name}
      onClick={() => removeFile(file)}
    >
      <div className="absolute opacity-0 hover:opacity-100 duration-500 cursor-pointer flex justify-center items-center top-0 left-0 w-full h-full bg-slate-700/50">
        <TrashIcon size={24} className="w-10 h-10" />
      </div>
      <div className="flex w-auto overflow-hidden">
        <img
          src={file.preview}
          className="block w-auto h-full object-center object-contain"
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </button>
  ));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(files);
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-4">
      <section className=" flex flex-col flex-1 h-full max-h-[calc(100dvh-200px)]">
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-gray-300 rounded-lg p-4 py-12"
        >
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>

        <div className="w-full grid grid-flow-row justify-items-center grid-cols-2 gap-2 mt-2 overflow-y-auto">
          {thumbs}
        </div>

        <Button
          type="button"
          onClick={removeAllFiles}
          variant="outline"
          size="sm"
          className={cn(
            files.length > 0 ? "block" : "hidden",
            "mt-2 cursor-pointer"
          )}
        >
          Clear
        </Button>
      </section>

      <Button type="submit" className="cursor-pointer">
        Submit
      </Button>
    </form>
  );
}
