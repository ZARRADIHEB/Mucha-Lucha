import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

const StarRatingComponent = ({ rating, handleRatingChange }) => {
  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      key={star}
      className={` p-2 rounded-full transition-colors ${
        star <= rating
          ? "text-yellow-500 hover:bg-black"
          : "hover:bg-primary hover:text-primary-foreground"
      }`}
      icon="star"
      variant="outline"
      size="icon"
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
    >
      <StarIcon
        className={`size-6 ${
          star <= rating ? "fill-yellow-500" : " fill-black dark:fill-white"
        }`}
      />
    </Button>
  ));
};

export default StarRatingComponent;
