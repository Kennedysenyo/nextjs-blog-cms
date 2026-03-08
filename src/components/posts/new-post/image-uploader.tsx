import Image from "next/image";
import { ChangeEvent } from "react";
import { Spinner } from "../../ui/spinner";

interface Props {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  src: string;
  isLoading: boolean;
}

export const ImageUploader = ({ onChange, src, isLoading }: Props) => {
  return (
    <div className="flex flex-col gap-2 md:w-1/2">
      <div className="flex flex-col">
        <label
          htmlFor="featuredImage"
          className="text-sm font-semibold text-brand-blue"
        >
          Featured Image
        </label>
        <input
          type="file"
          accept=".gif, .webp, .svg"
          disabled={isLoading}
          className="bg-white px-4 py-3 rounded-sm border border-gray-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 outline-none transition-all"
          onChange={onChange}
        />
      </div>

      <div className=" relative border border-gray-200 w-full aspect-[2/1.3] object-fit-cover flex items-center justify-center">
        {isLoading ? (
          <Spinner className="size-15 md:size-20 text-brand-green" />
        ) : (
          src && <Image src={src} alt="post image" fill />
        )}
      </div>
    </div>
  );
};
