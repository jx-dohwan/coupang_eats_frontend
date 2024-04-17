import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// 가정하는 추가 컴포넌트들


export const LoggedInRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<React.Fragment />} />
        <Route path="/signup" element={<React.Fragment />} />
      </Routes>
    </BrowserRouter>
  );
};

export default LoggedInRouter;
