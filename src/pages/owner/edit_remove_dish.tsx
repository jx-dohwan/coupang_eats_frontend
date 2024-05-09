import { gql, useMutation, useQuery } from "@apollo/client";
import { DISH_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useNavigate, useParams } from "react-router-dom";
import {
    EditDishMutation,
    EditDishMutationVariables,
    DeleteDishMutation,
    DeleteDishMutationVariables,
    MyRestaurantQuery,
    MyRestaurantQueryVariables,
} from "../../__api__/graphql";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet } from "react-helmet";
import { BsCamera } from "react-icons/bs";
import { useEffect, useState } from "react";

const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

const EDIT_DISH_MUTATION = gql`
  mutation editDish($input: EditDishInput!) {
    editDish(input: $input) {
      ok
      error
    }
  }
`;

const DELETE_DISH_MUTATION = gql`
  mutation deleteDish($input: DeleteDishInput!) {
    deleteDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
    restaurantId: string;
    dishId: string;
}

interface IForm {
    name: string;
    price: string;
    description: string;
    file?: FileList;
}

interface IFormOptions {
    [key: string]: string;
}

export const EditRemoveDish = () => {
    const { restaurantId, dishId } = useParams() as unknown as IParams;
    const navigate = useNavigate();

    const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(MY_RESTAURANT_QUERY, {
        variables: {
            input: {
                id: +restaurantId,
            },
        },
    });
    console.log("editdish", data)

    const [editDishMutation, { loading: editLoading }] = useMutation<EditDishMutation, EditDishMutationVariables>(
        EDIT_DISH_MUTATION,
        {
            refetchQueries: [
                {
                    query: MY_RESTAURANT_QUERY,
                    variables: {
                        input: {
                            id: +restaurantId,
                        },
                    },
                },
            ],
        }
    );

    const [deleteDishMutation, { loading: deleteLoading }] = useMutation<DeleteDishMutation, DeleteDishMutationVariables>(
        DELETE_DISH_MUTATION,
        {
            refetchQueries: [
                {
                    query: MY_RESTAURANT_QUERY,
                    variables: {
                        input: {
                            id: +restaurantId,
                        },
                    },
                },
            ],
        }
    );

    const currentDish = data?.myRestaurant.restaurant?.menu.find((dish) => dish.id === +dishId);

    const { register, handleSubmit, getValues, setValue, formState } = useForm<IForm & IFormOptions>({
        mode: "onChange",
        defaultValues: {
            name: currentDish?.name || "",
            price: currentDish?.price.toString() || "",
            description: currentDish?.description || "",
        },
    });

    const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
    const [optionsDetails, setOptionsDetails] = useState<Record<number, number[]>>({});

    useEffect(() => {
        if (currentDish) {
            setValue("name", currentDish.name);
            setValue("price", currentDish.price.toString());
            setValue("description", currentDish.description);

            const initialOptions = currentDish.options?.map((option, index) => index);
            setOptionsNumber(initialOptions!);

            const initialDetails = currentDish.options?.reduce<Record<number, number[]>>((acc, option, index) => {
                acc[index] = option.choices?.map((_, choiceIndex) => choiceIndex) || [];
                return acc;
            }, {});

            setOptionsDetails(initialDetails!);

            currentDish.options?.forEach((option, optionIndex) => {
                setValue(`${optionIndex}-optionName`, option.name);
                option.choices?.forEach((choice, choiceIndex) => {
                    setValue(`${optionIndex}-${choiceIndex}-optionChoiceName`, choice.name);
                    setValue(`${optionIndex}-${choiceIndex}-optionChoiceExtra`, choice.extra!.toString());
                });
            });
        }
    }, [currentDish, setValue]);

    const onSubmit = async () => {
        try {
            const { name, price, description, file, ...rest } = getValues();

            let photo;
            if (file && file.length > 0) {
                const actualFile = file[0];
                const formBody = new FormData();
                formBody.append("file", actualFile);

                const response = await fetch("http://localhost:4000/uploads/", {
                    method: "POST",
                    body: formBody,
                });
                const result = await response.json();
                photo = result.url;
            }

            const optionsObject = optionsNumber.map((optionIndex) => {
                const choices = optionsDetails[optionIndex]?.map((choiceIndex) => ({
                    name: rest[`${optionIndex}-${choiceIndex}-optionChoiceName`],
                    extra: +rest[`${optionIndex}-${choiceIndex}-optionChoiceExtra`],
                })).filter((choice) => choice.name);

                return {
                    name: rest[`${optionIndex}-optionName`],
                    choices,
                };
            }).filter((option) => option.name);

            await editDishMutation({
                variables: {
                    input: {
                        dishId: +dishId,
                        name,
                        price: +price,
                        description,
                        photo: photo || currentDish?.photo,
                        options: optionsObject,
                    },
                },
            });

            navigate(-1);
        } catch (error) {
            console.error("오류 발생:", error);
        }
    };

    const onDelete = async () => {
        if (window.confirm("이 음식을 삭제하시겠습니까?")) {
            try {
                await deleteDishMutation({
                    variables: {
                        input: {
                            dishId: +dishId,
                        },
                    },
                });

                navigate(-1);
            } catch (error) {
                console.error("오류 발생:", error);
            }
        }
    };

    const onAddOptionClick = () => {
        const newId = optionsNumber.length;
        setOptionsNumber((current) => [...current, newId]);
        setOptionsDetails((details) => ({ ...details, [newId]: [] }));
    };

    const onAddOptionDetailClick = (optionIndex: number) => {
        const newDetailId = optionsDetails[optionIndex]?.length || 0;
        setOptionsDetails((details) => ({
            ...details,
            [optionIndex]: [...(details[optionIndex] || []), newDetailId],
        }));
    };

    const onDeleteClick = (optionIndex: number) => {
        setOptionsNumber((current) => current.filter((id) => id !== optionIndex));
        setOptionsDetails((details) => {
            const newDetails = { ...details };
            delete newDetails[optionIndex];
            return newDetails;
        });
    };

    const onDeleteDetailClick = (optionIndex: number, detailIndex: number) => {
        setOptionsDetails((details) => ({
            ...details,
            [optionIndex]: details[optionIndex]?.filter((id) => id !== detailIndex),
        }));
    };

    return (
        <div className="container flex flex-col items-center mt-32">
            <Helmet>
                <title>음식 수정 | Coupang Eats</title>
            </Helmet>
            <h4 className="font-semibold text-2xl mb-3">음식 수정/삭제</h4>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid max-w-screen-md gap-3 mt-5 w-full mb-5"
            >
                <input
                    {...register("name", { required: "이름은 필수입니다." })}
                    className="input"
                    type="text"
                    name="name"
                    placeholder="이름"
                />
                <input
                    {...register("price", { required: "가격은 필수입니다." })}
                    className="input"
                    type="number"
                    name="price"
                    min={0}
                    placeholder="가격"
                />
                <input
                    {...register("description", { required: "설명은 필수입니다." })}
                    className="input"
                    type="text"
                    name="description"
                    placeholder="설명"
                />
                <div className="flex gap-2">
                    <input
                        {...register("file")}
                        type="file"
                        id="file"
                        accept="image/*"
                        className="hidden"
                    />
                    <label
                        htmlFor="file"
                        className="flex flex-col items-center justify-center border border-gray-400 p-2 text-sm"
                    >
                        <BsCamera className="text-3xl" />
                        사진 수정
                    </label>
                </div>
                <div className="my-10">
                    <h4 className="font-medium mb-3 text-lg"></h4>
                    <span
                        onClick={onAddOptionClick}
                        className="cursor-pointer text-white bg-sky-500 hover:bg-sky-600 py-1 px-2 mt-5"
                    >
                        옵션 카테고리 추가
                    </span>
                    {optionsNumber.length !== 0 &&
                        optionsNumber.map((optionIndex) => (
                            <div key={optionIndex} className="mt-5">
                                <input
                                    {...register(`${optionIndex}-optionName`, { required: "옵션 이름은 필수입니다." })}
                                    className="py-2 px-3 focus:outline-none mr-3 focus:border-gray-600 border-2"
                                    type="text"
                                    placeholder="옵션 카테고리 이름"
                                />
                                <span
                                    onClick={() => onAddOptionDetailClick(optionIndex)}
                                    className="cursor-pointer text-white bg-sky-500 hover:bg-sky-600 py-3 px-4 mt-5"
                                >
                                    옵션 추가
                                </span>
                                <span
                                    className="cursor-pointer text-white bg-red-700 ml-3 py-3 px-4 mt-5"
                                    onClick={() => onDeleteClick(optionIndex)}
                                >
                                    옵션 카테고리 삭제
                                </span>
                                {optionsDetails[optionIndex]?.map((detailIndex) => (
                                    <div key={detailIndex} className="mt-5">
                                        <input
                                            {...register(`${optionIndex}-${detailIndex}-optionChoiceName`, { required: "옵션 이름은 필수입니다." })}
                                            className="py-2 px-3 focus:outline-none mr-3 focus:border-gray-600 border-2"
                                            type="text"
                                            placeholder="옵션 이름"
                                        />
                                        <input
                                            {...register(`${optionIndex}-${detailIndex}-optionChoiceExtra`)}
                                            className="py-2 px-3 focus:outline-none focus:border-gray-600 border-2"
                                            type="number"
                                            min={0}
                                            placeholder="추가 비용"
                                        />
                                        <span
                                            className="cursor-pointer text-white bg-red-700 ml-3 py-3 px-4 mt-5"
                                            onClick={() => onDeleteDetailClick(optionIndex, detailIndex)}
                                        >
                                            옵션 삭제
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                </div>
                <Button
                    loading={editLoading}
                    canClick={formState.isValid}
                    actionText="음식 수정하기"
                />
                <button
                    className="text-lg font-medium focus:outline-none text-white py-4 transition-colors bg-sky-500 hover:bg-sky-600"
                    onClick={onDelete}
                >
                    음식 삭제하기
                </button>
            </form>

        </div>
    );
};
