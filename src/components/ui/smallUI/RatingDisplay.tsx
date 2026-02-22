import { IconStar, IconStarFilled } from "@tabler/icons-react";

type RatingDisplayProps = {
  rating?: number | null;
  max?: number;
  size?: number;
  label?: boolean;
};

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  max = 5,
  size,
  label,
}) => {
  // If no rating, show a simple fallback
  if (rating === null || rating === undefined) {
    return <span className="text-sm text-zinc-400">(No rating)</span>;
  }

  // Clamp and normalise just in case
  const safeRating = Math.min(Math.max(Math.round(rating), 0), max);

  const stars = Array.from({ length: max }, (_, index) =>
    index < safeRating ? (
      <IconStarFilled
        key={index}
        size={size || 18}
        className="inline-block text-yellow-500"
      />
    ) : (
      <IconStar
        key={index}
        size={size || 18}
        stroke={1.5}
        className="inline-block text-gray-300"
      />
    ),
  );

  return (
    <div className="flex items-center gap-2" title={`Rating: ${safeRating} out of ${max} stars`}>
        {label && <span className="ml-1 text-zinc-500 text-sm">({safeRating})</span>}
      
      {stars}
    </div>
  );
};

export default RatingDisplay;
