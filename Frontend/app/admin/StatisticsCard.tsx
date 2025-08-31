import { StatisticCard } from "./types";

export const StatisticsCard: React.FC<StatisticCard> = ({
  title,
  value,
  iconUrl,
}) => {
  return (
    <article className="flex overflow-hidden flex-col grow shrink justify-center self-stretch px-6 py-10 my-auto bg-gray-200 rounded-lg border border-solid border-[color:var(--Foundation-Green-G100,#8A9891)] min-w-60 w-[250px] max-md:px-5">
      <div className="flex gap-10 justify-between items-start w-full">
        <div className="w-[185px]">
          <p className="text-3xl font-semibold text-neutral-700">{value}</p>
          <p className="mt-2 text-base font-medium text-neutral-500">{title}</p>
        </div>
        <img
          src={iconUrl}
          className="object-contain shrink-0 w-8 aspect-square"
          alt={`${title} icon`}
        />
      </div>
    </article>
  );
};
