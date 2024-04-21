import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { Header } from "../components/header";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { NotFound } from "../pages/404";
import { UserRole } from "../__api__/graphql";
import { Restaurants } from "../pages/client/restaurants";
import { AddRestaurant } from "../pages/owner/add-restaurants";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";
import { AddDish } from "../pages/owner/add-dish";

const clientRoutes = [
  { path: "/", element: <Restaurants /> },
  // 2024.04.18
  { path: "/search", element: <Search /> },
  { path: "/category/:slug", element: <Category /> },
  { path: "/restaurant/:id", element: <React.Fragment /> },
  { path: "/ordering/:id", element: <React.Fragment /> },
  { path: "/cart/:id", element: <React.Fragment /> },
  { path: "/delivery-details/:id", element: <React.Fragment /> },
  //2024.04.19
  { path: "/create-reviews/:id", element: <React.Fragment /> },

];

const commonRoutes = [
  { path: "/confirm", element: <ConfirmEmail /> },
  { path: "/edit-profile", element: <EditProfile /> },

  //2024.04.19
  { path: "/order/:id", element: <React.Fragment /> },
  { path: "/reviews/:id", element: <React.Fragment /> },

];

const restaurantRoutes = [
  // 2024.04.19
  { path: "/", element: <MyRestaurants /> },
  { path: "/add-restaurant", element: <AddRestaurant /> },
  { path: "/restaurants/:id", element: <React.Fragment /> },
  { path: "/restaurants/:restaurantId/add-dish", element: <AddDish /> },
];

const driverRoutes = [{ path: "/", element: <React.Fragment /> }];

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
