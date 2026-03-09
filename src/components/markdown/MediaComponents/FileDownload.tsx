// components/markdown/MediaComponents/FileDownload.tsx
import React from "react";
import { FileText, Download, File, Archive, FileImage } from "lucide-react";
import { BaseMediaProps } from "@/types/markdown";
import { cn } from "@/lib/utils/utils";

interface FileDownloadProps extends BaseMediaProps {
  fileName: string;
  fileType: string;
  fileSize?: string;
}

export const FileDownload: React.FC<FileDownloadProps> = ({
  url,
  fileName,
  fileType,
  fileSize,
  title,
  className,
  style,
}) => {
  const getFileIcon = () => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "zip":
      case "rar":
        return <Archive className="h-8 w-8 text-yellow-500" />;
      case "jpg":
      case "png":
      case "gif":
      case "webp":
        return <FileImage className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-blue-500" />;
    }
  };

  const getFileColor = () => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-900/20";
      case "zip":
        return "border-yellow-100 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20";
      case "docx":
        return "border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20";
      case "pptx":
        return "border-orange-100 bg-orange-50 dark:border-orange-900 dark:bg-orange-900/20";
      default:
        return "border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border my-4",
        getFileColor(),
        className,
      )}
      style={style}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">{getFileIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {title || fileName}
          </p>
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {fileType}
            </span>
            {fileSize && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                • {fileSize}
              </span>
            )}
          </div>
        </div>
      </div>
      <a
        href={url}
        download={fileName}
        className="ml-4 flex-shrink-0 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        rel="noopener noreferrer"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </a>
    </div>
  );
};
