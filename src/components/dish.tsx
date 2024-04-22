import { DishOption } from "../__api__/graphql";

interface IDishProps {
    id?: number;
    description: string;
    name: string;
    price: number;
    isCustomer?: boolean;
    orderStarted?: boolean;
    isSelected?: boolean;
    options?: DishOption[] | null;
    addItemToOrder?: (dishId: number) => void;
    removeFromOrder?: (dishId: number) => void;
    children?: React.ReactNode;
}

export const Dish: React.FC<IDishProps> = ({
    id = 0,
    description,
    name,
    price,
    isCustomer = false,
    orderStarted = false,
    options,
    isSelected,
    addItemToOrder,
    removeFromOrder,
    children: dishOptions,
}) => {

    return (
        <div
            className={`px-8 py-4 border cursor-pointer transition-all ${isSelected ? "border-gray-800" : "hover:border-gray-800"}`}
        >
            <div className="mb-5">
                <h3 className="text-lg font-medium flex items-center">
                    {name}{" "}

                </h3>
                <h4 className="font-medium">{description}</h4>
            </div>
            <span>${price}</span>
            {isCustomer && options && options?.length !== 0 && (
                <div>
                    <h5 className="mt-8 mb-3 font-medium">음식 옵션:</h5>
                    <div className="grid gap-2 justify-start">{dishOptions}</div>
                </div>
            )}
        </div>
    )
}