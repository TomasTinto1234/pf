import { Box } from "@chakra-ui/react";
import React from "react";
// import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import ReactStars from "react-rating-stars-component";

export default function Rating({ allUserInfo }) {
  /* const rating = 0;
  const numReviews = 0; */

  return (
    <Box>
      <Box d="flex" alignItems="center">
        {/* {Array(5)
          .fill("")
          .map((_, i) => {
            const roundedRating = Math.round(rating * 2) / 2;
            if (roundedRating - i >= 1) {
              return (
                <BsStarFill
                  key={i}
                  style={{ marginLeft: "1" }}
                  color={i < rating ? "teal.500" : "gray.300"}
                />
              );
            }
            if (roundedRating - i === 0.5) {
              return <BsStarHalf key={i} style={{ marginLeft: "1" }} />;
            }
            return <BsStar key={i} style={{ marginLeft: "1" }} />;
          })} */}
        <ReactStars
          count={5}
          size={34}
          activeColor="#F6AD55"
          edit={false}
          value={allUserInfo.rating}
          isHalf={true}
        />
        <Box as="span" ml="2" color="gray.600" fontSize="sm">
          {allUserInfo.ratingAmount} review{allUserInfo.ratingAmount > 1 && "s"}
        </Box>
      </Box>
    </Box>
  );
}
