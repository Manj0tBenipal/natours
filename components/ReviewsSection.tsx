"use client";
import { useCallback, useContext, useEffect, useState } from "react";
import { Pagination, Button, Divider } from "@nextui-org/react";
import ReviewCard from "./ui/ReviewCard";
import SkeletonComponent from "./ui/Skeleton";
import AddReview from "./AddReview";
import { UserContext } from "./providers/UserContextProvider";

export default function ReviewsSection({ tourId }: { tourId: string }) {
  const { user } = useContext(UserContext);
  const [fetching, setFetching] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([] as Review[]);
  const [currentPage, setCurrentPage] = useState(1);

  //This state is used to trigger a useEffect to refetch the reviews when
  //a user adds a new review
  const [reloadReviews, setRelaodReviews] = useState<boolean>(false);
  const skeletons: JSX.Element[] = [];
  for (let i = 0; i < 4; i++) {
    skeletons.push(<SkeletonComponent key={i} />);
  }
  const fetchReviews = useCallback(
    async function fetchReviews() {
      try {
        setFetching(true);
        const reviewsPromise = await fetch(
          `/api/reviews/${tourId}${currentPage > 1 ? "?page=" + currentPage : ""}`
        );
        const reviewsRes = await reviewsPromise.json();
        if (reviewsRes.status === "fail" || reviewsRes.err)
          throw new Error(reviewsRes.err);
        const reviews: Review[] = reviewsRes.data;
        if (reviews?.length > 0) {
          setTotalPages(reviewsRes.totalPages);
          setReviews(reviews);
          setFetching(false);
        }
      } catch (err) {
        console.log(err);
        setFetching(false);
      }
    },
    [currentPage, tourId]
  );
  function changeToLastPage() {
    setCurrentPage(totalPages);
  }
  useEffect(() => {
    fetchReviews();
  }, [currentPage, reloadReviews, fetchReviews]);
  return (
    <div className="flex flex-col gap-y-4  bg-slate-200 rounded-2xl p-4">
      <h1 className="text-3xl text-gradient font-bold">Reviews</h1>
      <AddReview
        tourId={tourId}
        reloadReviews={setRelaodReviews}
        changeToLastPage={changeToLastPage}
      />

      {fetching ? (
        skeletons.map((s) => s)
      ) : (
        <>
          <div className="flex flex-col gap-y-2">
            {reviews?.length > 0
              ? reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    currentUser={user._id}
                    reloadReviews={setRelaodReviews}
                  />
                ))
              : "No reviews yet"}
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-small text-default-500">
              Selected Page: {currentPage}
            </p>
            <Pagination
              total={totalPages}
              color="primary"
              page={currentPage}
              onChange={setCurrentPage}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onPress={() =>
                  setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                }
              >
                Previous
              </Button>
              <Button
                isDisabled={currentPage === totalPages}
                size="sm"
                variant="flat"
                color="primary"
                onPress={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
