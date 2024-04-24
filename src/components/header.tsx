import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import coupangEatsLogo from "../images/coupang-eats-delivery-190910-04.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { UserRole } from "../__api__/graphql";

export const Header: React.FC = () => {
  const { data } = useMe();

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-sky-500 p-3 text-center text-base text-white">
          <span>이메일을 확인해 주세요.</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={coupangEatsLogo} className="w-64 h-auto" alt="Coupang Eats" />
          </Link>
          <span className="text-xs">
            {data?.me.role === UserRole.Client ? (
              <Link to="/order-history">
                <FontAwesomeIcon icon={faUser} className="text-3xl" />
              </Link>
            ) : (
              <Link to="/edit-profile">
                <FontAwesomeIcon icon={faUser} className="text-3xl" />
              </Link>
            )}
          </span>
        </div>
      </header>
    </>
  );
};