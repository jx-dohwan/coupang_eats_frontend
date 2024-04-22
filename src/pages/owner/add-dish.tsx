import { gql, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { CreateDishMutation, CreateDishMutationVariables } from "../../__api__/graphql";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useForm } from "react-hook-form";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "../../components/button";


const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
    restaurantId: string;
}

interface IForm {
    name: string;
    price: string;
    description: string;
    [key: string]: string;
}

export const AddDish = () => {
    const { restaurantId } = useParams() as unknown as IParams;
    const navigate = useNavigate();
    const [createDishMutation, { loading }] = useMutation<
        CreateDishMutation,
        CreateDishMutationVariables
    >(CREATE_DISH_MUTATION, {
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
    });
    const {
        register,
        handleSubmit,
        formState,
        getValues,
        setValue,
    } = useForm<IForm>({
        mode: "onChange",
    });

    const onSubmit = () => {
        const { name, price, description, ...rest } = getValues();
        const optionsObject = optionsNumber.map((id) => ({
            extra: +rest[`${id}-optionExtra`],
            name: rest[`${id}-optionName`],
        }));
        createDishMutation({
            variables: {
                input: {
                    name,
                    price: +price,
                    description,
                    restaurantId: +restaurantId,
                    options: optionsObject,
                },
            },
        });
        navigate(-1);
    };
    const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
    const onAddOptionClick = () => {
        setOptionsNumber((current) => [Date.now(), ...current]);
    };
    const onDeleteClick = (idToDelete: number) => {
        setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
        setValue(`${idToDelete}-optionName`, "");
        setValue(`${idToDelete}-optionExtra`, "");
    };
    return (
        <div className="container flex flex-col items-center mt-52">
            <Helmet>
                <title>음식 추가 | Coupang Eats</title>
            </Helmet>
            <h4 className="font-semibold text-2xl mb-3">음식 추가</h4>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
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
                <div className="my-10">
                    <h4 className="font-medium mb-3 text-lg">
                        음식 옵션
                    </h4>
                    <span
                        onClick={onAddOptionClick}
                        className="cursor-pointer text-white bg-sky-500 hover:bg-sky-600 py-1 px-2 mt-5"
                    >
                        옵션 추가하기
                    </span>
                    {optionsNumber.length !== 0 &&
                        optionsNumber.map((id) => (
                            <div key={id} className="mt-5">
                                <input
                                    {...register(`${id}-optionName`)}
                                    className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                                    type="text"
                                    placeholder="옵션 이름"
                                />
                                <input
                                    {...register(`${id}-optionExtra`)}
                                    className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                                    type="number"
                                    min={0}
                                    placeholder="추가"
                                />
                                <span
                                    className="cursor-pointer text-white bg-red-700 ml-3 py-3 px-4 mt-5 bg-"
                                    onClick={() => onDeleteClick(id)}
                                >
                                    옵션 삭제하기
                                </span>
                            </div>
                        ))}
                </div>
                <Button
                    loading={loading}
                    canClick={formState.isValid}
                    actionText="음식 만들기"
                />

            </form>

        </div>
    )
}