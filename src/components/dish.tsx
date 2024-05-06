import { DishOption } from "../__api__/graphql";
import KRW from "./currency_formatter";

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
    const handleToggleOrder = () => {
        if (isSelected) {
            removeFromOrder?.(id);
        } else {
            addItemToOrder?.(id);
        }
    };


    return (
        <div
            onClick={handleToggleOrder}
            className={`p-6 border rounded-lg cursor-pointer transition-all shadow-sm hover:shadow-md ${
                isSelected ? "border-gray-800 bg-gray-50" : "border-gray-300 hover:border-gray-800"
            }`}
        >
            <div className="mb-4 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold">{name}</h3>
                    <h4 className="text-sm text-gray-600">{description}</h4>
                </div>
                {orderStarted && (
                    <span
                        className={`text-sm px-2 py-1 border rounded-full ${
                            isSelected ? "bg-red-600 text-white" : "bg-green-600 text-white"
                        }`}
                    >
                        {isSelected ? "Remove" : "Add"}
                    </span>
                )}
            </div>
            <span className="text-lg font-medium text-gray-800"><KRW price={price} /></span>
            {isCustomer && options && options.length !== 0 && (
                <div className="mt-6">
                    <h3 className="mb-3 text-md font-semibold text-gray-800">음식 옵션</h3>
                    {options.map((option, optionIndex) => (
                        <div key={optionIndex} className="mb-3">
                            <strong className="block font-medium text-gray-700">{option.name}</strong>
                            {option.choices && option.choices.map((choice, choiceIndex) => (
                                <div
                                    key={choiceIndex}
                                    className="ml-4 text-sm text-gray-600 flex items-center"
                                >
                                    - {choice.name} (추가 비용: {choice.extra ? `${choice.extra}원` : "무료"})
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
            {dishOptions && <div className="mt-4">{dishOptions}</div>}
        </div>
    )
}