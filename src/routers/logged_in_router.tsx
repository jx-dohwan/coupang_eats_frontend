import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { Header } from "../components/header";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { NotFound } from "../pages/404";
import { UserRole } from "../__api__/graphql";
import { Restaurants } from "../pages/client/restaurants";
import { AddRestaurant } from "../pages/owner/add_restaurants";
import { MyRestaurants } from "../pages/owner/my_restaurants";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";
import { AddDish } from "../pages/owner/add_dish";
import { MyRestaurant } from "../pages/owner/my_restaurant";
import { Restaurant } from "../pages/client/restaurant";
import { Menu } from "../pages/client/menu";
import { OrderHistory } from "../pages/client/order_history";
import { Order } from "../pages/order";
import { DriverDashboard } from "../pages/driver/driver_dashboard";
import { CreateReview } from "../pages/review/create-review";
import { Reviews } from "../pages/review/reviews";
import { EditRemoveDish } from "../pages/owner/edit_remove_dish";

const clientRoutes = [
  { path: "/", element: <Restaurants /> },
  { path: "/search", element: <Search /> },
  { path: "/category/:slug", element: <Category /> },
  { path: "/restaurants/:id", element: <Restaurant /> },
  { path: "/restaurants/:restaurantId/menu/:menuId", element: <Menu /> },
  { path: "/order-history", element: <OrderHistory /> },
  { path: "/create-review/:id", element: <CreateReview /> },
];

const commonRoutes = [
  { path: "/confirm", element: <ConfirmEmail /> },
  { path: "/edit-profile", element: <EditProfile /> },
  { path: "/order/:id", element: <Order /> },
  { path: "/reviews/:id", element: <Reviews /> },

];

const restaurantRoutes = [
  { path: "/", element: <MyRestaurants /> },
  { path: "/add-restaurant", element: <AddRestaurant /> },
  { path: "/restaurants/:id", element: <MyRestaurant /> },
  { path: "/restaurants/:restaurantId/edit_remove_dish/:dishId", element: <EditRemoveDish /> },
  { path: "/restaurants/:restaurantId/add-dish", element: <AddDish /> },
];

const driverRoutes = [{ path: "/", element: <DriverDashboard /> }];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        {data.me.role === UserRole.Client && clientRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {data.me.role === UserRole.Owner && restaurantRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {data.me.role === UserRole.Delivery && driverRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
