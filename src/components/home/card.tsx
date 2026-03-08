import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface CardProps {
  figure: number;
  title: string;
  color: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const Card = ({ figure, title, color, icon: Icon }: CardProps) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className="relative overflow-hidden   w-full shadow-md p-2 md:p-4 rounded-lg aspect-[2/1.5] flex flex-col justify-center items-center space-y-4"
    >
      <p className="text-4xl lg:text-5xl  text-white text-shadow-sm">
        {figure}
      </p>
      <div className="flex justify-center items-center gap-3 text-white text-shadow-md">
        <Icon className="w-7 h-7" />{" "}
        <span className=" text-xl md:text-2xl lg:text-3xl text-center">
          {title}
        </span>
      </div>
      <Icon className="w-40 h-40  absolute -top-7 -right-8 opacity-20" />
    </div>
  );
};
