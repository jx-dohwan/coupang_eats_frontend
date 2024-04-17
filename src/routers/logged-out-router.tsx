import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CreateAccount } from "../pages/create-account";
// import { Login } from "../pages/login";
// import { NotFound } from "../pages/404";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/" element={<React.Fragment />} /> {/* Login 컴포넌트를 여기에 포함시키세요 */}
        <Route path="*" element={<React.Fragment />} /> {/* NotFound 컴포넌트를 여기에 포함시키세요 */}
      </Routes>
    </Router>
  );
};
