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
            <span><KRW price={price} /></span>
            {isCustomer && options && options?.length !== 0 && (
                <div>
                    <h3 className="mt-8 mb-3 font-medium">음식 옵션</h3>

                    {options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                            <strong>{option.name}</strong>
                            {option.choices && option.choices.map((choice, choiceIndex) => (
                                <div key={choiceIndex} style={{ marginLeft: '20px' }}>
                                    - {choice.name} (추가 비용: {choice.extra ? `${choice.extra}원` : "무료"})
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}