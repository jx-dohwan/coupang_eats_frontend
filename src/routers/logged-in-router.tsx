import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotFound } from "../pages/404";
import { Restaurants } from '../pages/client/restaurants';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';

export const LoggedInRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Restaurants />} />
        <Route path="/confirm" element={<ConfirmEmail />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default LoggedInRouter;
