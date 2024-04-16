import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import coupangEatsLogo from "../images/coupang-eats-delivery-190910-04.png";

export const Header: React.FC = () => {
    const {data} = useMe();
    return (
        <header className="py-4">
            <div className='w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center'>
                <Link to="/">
                    <img src={coupangEatsLogo} className="w-64 h-auto" alt="Coupang Eats" />
                </Link>
                <span className="text-xs">
                    <Link to="/">
                        
                    </Link>
                </span>
            </div>
        </header>
    );
};