import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { X } from "lucide-react";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrls?: string[];
};

const FileUploader = ({ fieldChange, mediaUrls }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>(mediaUrls || []);

  const convertFileToUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Limit to maximum 2 images total
      const currentCount = files.length;
      const availableSlots = 2 - currentCount;
      const filesToAdd = acceptedFiles.slice(0, availableSlots);
      
      if (filesToAdd.length < acceptedFiles.length) {
        // Could show a toast here about the limit
        console.warn("Maximum 2 images allowed per post");
      }

      const newFiles = [...files, ...filesToAdd];
      const newUrls = [...fileUrls, ...filesToAdd.map(convertFileToUrl)];
      
      setFiles(newFiles);
      setFileUrls(newUrls);
      fieldChange(newFiles);
    },
    [files, fileUrls, fieldChange]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newUrls = fileUrls.filter((_, i) => i !== index);
    
    setFiles(newFiles);
    setFileUrls(newUrls);
    fieldChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".webp"],
    },
    maxFiles: 2,
    disabled: files.length >= 2
  });

  return (
    <div className="w-full">
      {/* Display current images */}
      {fileUrls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {fileUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area - only show if less than 2 images */}
      {files.length < 2 && (
        <div
          {...getRootProps()}
          className={`flex flex-center flex-col bg-gray-200 rounded-xl cursor-pointer p-6 border-2 border-dashed transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} className="cursor-pointer" />

          <div className="file_uploader-box text-center">
            <img
              src="/assets/icons/file-upload.svg"
              width={96}
              height={77}
              alt="file upload"
              className="mx-auto"
            />

            <h3 className="base-medium text-gray-500 font-semibold mb-2 mt-6">
              {isDragActive ? "Drop photos here" : "Drag photos here"}
            </h3>
            <p className="text-light-4 small-regular mb-4">
              SVG, PNG, JPG, WEBP (Max 2 images)
            </p>
            <p className="text-sm text-gray-400 mb-4">
              {files.length}/2 images selected
            </p>

            <Button type="button" className="shad-button_dark_4">
              Select from computer
            </Button>
          </div>
        </div>
      )}
      
      {files.length >= 2 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Maximum number of images reached (2/2)
        </p>
      )}
    </div>
  );
};

export default FileUploader;