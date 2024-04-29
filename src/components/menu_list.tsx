import { BiCartAdd } from "react-icons/bi";
import KRW from "./currency_formatter";
import { Link } from "react-router-dom";

interface IMenuProps {
    id?: number;
    name: string;
    price: number;
    description: string;
}

export const MenuList: React.FC<IMenuProps> = ({
    id,
    name,
    price,
    description
}) => {
    return (
        <div>
            <div className="relative" key={id}>
            
                <Link className="grid grid-cols-3" to={`/menu/${id}`} >
                    <div className="col-span-2">
                        <h3 className="text-lg font-bold">{name}</h3>
                        <h4 className="text-lg">
                            <KRW price={price} />
                        </h4>
                        <p className="text-sm">{description}</p>
                    </div>
                </Link>

                <div className="absolute right-0 top-0 flex h-full items-center">
                    {/* 추가할 내용 */}
                    <BiCartAdd />
                </div>
            </div>
        </div>
    );
};