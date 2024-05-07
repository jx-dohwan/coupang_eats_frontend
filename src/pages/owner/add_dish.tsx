import { gql, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { CreateDishMutation, CreateDishMutationVariables } from "../../__api__/graphql";
import { MY_RESTAURANT_QUERY } from "./my_restaurant";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "../../components/button";
import { BsCamera } from "react-icons/bs";

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
  file?: FileList;
}

interface IFormOptions {
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
  } = useForm<IForm & IFormOptions>({
    mode: "onChange",
  });

  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const [optionsDetails, setOptionsDetails] = useState<Record<number, number[]>>({});

  const onSubmit = async () => {
    try {
      const { name, price, description, file, ...rest } = getValues();
      console.log("폼 데이터:", { name, price, description, file, rest });

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

      const optionsObject = optionsNumber.map((categoryId) => {
        const choices = optionsDetails[categoryId]?.map((detailId) => {
          return {
            name: rest[`${categoryId}-${detailId}-optionChoiceName`],
            extra: +rest[`${categoryId}-${detailId}-optionChoiceExtra`],
          };
        }).filter((choice) => choice.name);

        return {
          name: rest[`${categoryId}-optionName`],
          choices,
        };
      }).filter((option) => option.name);

      await createDishMutation({
        variables: {
          input: {
            name,
            price: +price,
            description,
            photo: photo,
            restaurantId: +restaurantId,
            options: optionsObject,
          },
        },
      });

      navigate(-1);
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  const onAddOptionClick = () => {
    const newId = Date.now();
    setOptionsNumber((current) => [newId, ...current]);
    setOptionsDetails((details) => ({ ...details, [newId]: [] }));
  };

  const onAddOptionDetailClick = (categoryId: number) => {
    const newDetailId = Date.now();
    setOptionsDetails((details) => ({
      ...details,
      [categoryId]: [newDetailId, ...details[categoryId]],
    }));
  };

  const onDeleteClick = (categoryId: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== categoryId));
    setOptionsDetails((details) => {
      const newDetails = { ...details };
      delete newDetails[categoryId];
      return newDetails;
    });
  };

  const onDeleteDetailClick = (categoryId: number, detailId: number) => {
    setOptionsDetails((details) => ({
      ...details,
      [categoryId]: details[categoryId].filter((id) => id !== detailId),
    }));
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>음식 추가 | Coupang Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">음식 추가</h4>
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
            {...register("file", { required: true })}
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
            사진 추가
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
            optionsNumber.map((categoryId) => (
              <div key={categoryId} className="mt-5">
                <input
                  {...register(`${categoryId}-optionName`)}
                  className="py-2 px-3 focus:outline-none mr-3 focus:border-gray-600 border-2"
                  type="text"
                  placeholder="옵션 카테고리 이름"
                />
                <span
                  onClick={() => onAddOptionDetailClick(categoryId)}
                  className="cursor-pointer text-white bg-sky-500 hover:bg-sky-600 py-3 px-4 mt-5"
                >
                  옵션 추가
                </span>
                <span
                  className="cursor-pointer text-white bg-red-700 ml-3 py-3 px-4 mt-5"
                  onClick={() => onDeleteClick(categoryId)}
                >
                  옵션 카테고리 삭제
                </span>
                {optionsDetails[categoryId]?.map((detailId) => (
                  <div key={detailId} className="mt-5">
                    <input
                      {...register(`${categoryId}-${detailId}-optionChoiceName`)}
                      className="py-2 px-3 focus:outline-none mr-3 focus:border-gray-600 border-2"
                      type="text"
                      placeholder="옵션 이름"
                    />
                    <input
                      {...register(`${categoryId}-${detailId}-optionChoiceExtra`)}
                      className="py-2 px-3 focus:outline-none focus:border-gray-600 border-2"
                      type="number"
                      min={0}
                      placeholder="추가 비용"
                    />
                    <span
                      className="cursor-pointer text-white bg-red-700 ml-3 py-3 px-4 mt-5"
                      onClick={() => onDeleteDetailClick(categoryId, detailId)}
                    >
                      옵션 삭제
                    </span>
                  </div>
                ))}
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
  );
};
