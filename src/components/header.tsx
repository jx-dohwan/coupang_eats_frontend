import { Link, useNavigate } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import coupangEatsLogo from "../images/coupang-eats-delivery-190910-04.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { UserRole } from "../__api__/graphql";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useState } from "react";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { authTokenVar, client, isLoggedInVar } from "../apollo";

export const Header: React.FC = () => {
  const { data } = useMe();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem(LOCALSTORAGE_TOKEN);
    authTokenVar(null);
    isLoggedInVar(false);
    navigate("/");
    await client.cache.reset(); 
    closeMenu();
   
  };
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-sky-500 p-3 text-center text-base text-white">
          <span>이메일을 확인해 주세요.</span>
        </div>
      )}
      <header className="py-4 relative">
        <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={coupangEatsLogo} className="w-64 h-auto" alt="Coupang Eats" />
          </Link>
          <span className="text-xs relative">
            <IoReorderThreeOutline
              size={48}
              onClick={toggleMenu}
              onMouseEnter={() => setIsMenuOpen(true)}
            />
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-32 bg-sky-500 rounded-md shadow-lg z-20"
                onMouseLeave={() => setTimeout(closeMenu, 300)}
              >
                <ul className="py-1">
                  {data?.me.role === UserRole.Client && (
                    <li>
                      <Link
                        to="/order-history"
                        className="block px-4 py-2"
                        onClick={closeMenu}
                      >
                        <span className="font-semibold text-lg text-white hover:text-gray-800 hover:underline">주문내역</span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/edit-profile"
                      className="block px-4 py-2"
                      onClick={closeMenu}
                    >
                      <span className="font-semibold text-lg text-white hover:text-gray-800 hover:underline">계정수정</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2"
                    >
                      <span className="font-semibold text-lg text-white hover:text-gray-800 hover:underline">로그아웃</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </span>
        </div>
      </header>
    </>
  );
};
