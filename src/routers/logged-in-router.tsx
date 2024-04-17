import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { Header } from "../components/header";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { NotFound } from "../pages/404";
import { UserRole } from "../__api__/graphql";
import { Restaurants } from "../pages/client/restaurants";

const clientRoutes = [
  { path: "/", element: <Restaurants /> },
  { path: "/search", element: <React.Fragment /> },
  { path: "/category/:slug", element: <React.Fragment /> },
  { path: "/restaurant/:id", element: <React.Fragment /> },
  
  { path: "/ordering/:id", element: <React.Fragment /> },
  { path: "/cart/:id", element: <React.Fragment /> },
  { path: "/create-reviews/:id", element: <React.Fragment /> },
  { path: "/delivery-details/:id", element: <React.Fragment /> },
];

const commonRoutes = [
  { path: "/confirm", element: <ConfirmEmail /> },
  { path: "/edit-profile", element: <EditProfile /> },
  { path: "/order/:id", element: <React.Fragment /> },
  { path: "/reviews/:id", element: <React.Fragment /> },

];

const restaurantRoutes = [
  { path: "/", element: <React.Fragment /> },
  { path: "/add-restaurant", element: <React.Fragment /> },
  { path: "/restaurants/:id", element: <React.Fragment /> },
  { path: "/restaurants/:restaurantId/add-dish", element: <React.Fragment /> },
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
