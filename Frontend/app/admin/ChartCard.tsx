import { ChartCardProps } from "./types";

export const ChartCard: React.FC<ChartCardProps> = ({ title, chartUrl }) => {
  return (
    <article className="flex flex-col grow pb-6 text-base font-semibold text-black max-md:mt-7 max-md:max-w-full">
      <div className="px-6 pt-6 pb-72 bg-white rounded-lg border border-solid border-zinc-200 min-h-[339px] max-md:px-5 max-md:pb-24 max-md:max-w-full">
        {title}
      </div>
      <img
        src={chartUrl}
        className="object-contain z-10 self-center mt-0 max-w-full aspect-[1.45] w-[364px] max-md:mt-0"
        alt={`${title} chart`}
      />
    </article>
  );
};
