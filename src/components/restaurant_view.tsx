import React from "react";
import { Link } from "react-router-dom";
import { StarsAndReviews } from "./stars_and_reviews";
import KRW from "./currency_formatter";

interface IRestaurantProps {
    id: string;
    coverImg: string;
    name: string;
    categoryName?: string;
    averageScore?:number;
    reviewCount?:number;
    deliveryFee?:number;
}

export const RestaurantView: React.FC<IRestaurantProps> = ({
    id,
    coverImg,
    name,
    categoryName,
    averageScore,
    reviewCount,
    deliveryFee,
}) => (
    <Link to={`/restaurants/${id}`}>
        <div className="flex flex-col">

            <div
                style={{ backgroundImage: `url(${coverImg})` }}
                className="bg-cover bg-center rounded-l-xl rounded-r-xl mb-3 py-28"
            ></div>
            <h3 className="text-xl font-semibold">{name}</h3>
            <div className="flex gap-2 text-sm">
                <div className="flex gap-2 text-sm">
                    <StarsAndReviews
                        rating={averageScore}
                        reviewCount={reviewCount}
                    />
                    <span className="text-gray-500">배달비 <KRW price={deliveryFee}/></span>
                </div>
            </div>


        </div>
    </Link>
);