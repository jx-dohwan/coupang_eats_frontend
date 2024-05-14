import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Button } from "../../components/button";
import { FormError } from "../../components/form_error";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateRestaurantMutation, CreateRestaurantMutationVariables } from "../../__api__/graphql";
import { useNavigate } from "react-router-dom";
import { MY_RESTAURANTS_QUERY } from "./my_restaurants";
import { BsCamera } from "react-icons/bs";


// 식당 생성을 위한 GraphQL 뮤테이션 정의, CreateRestaurantInput 타입을 받아 처리하고 에러 메시지, 성공 여부, 생성된 식당의 ID를 반환
const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

// 폼 데이터의 형태를 정의하는 TypeScript 인터페이스
interface IFormProps {
    name: string;          // 식당 이름
    address: string;       // 식당 주소
    categoryName: string;  // 카테고리 이름
    deliveryFee: string;  // 카테고리 이름
    minimumPrice: string;  // 카테고리 이름
    file: FileList;        // 파일 리스트, 이미지 파일 포함
}

// 식당 추가를 위한 리액트 컴포넌트
export const AddRestaurant = () => {
    // Apollo 클라이언트 접근을 위한 훅
    const client = useApolloClient();
    // 프로그래매틱 라우트 변경을 위한 훅
    const navigate = useNavigate();
    // 업로드된 이미지 URL을 저장하기 위한 상태
    const [imageUrl, setImageUrl] = useState("");
    // 뮤테이션 완료 후 실행되는 콜백 함수
    const onCompleted = (data: CreateRestaurantMutation) => {
        const {
            createRestaurant: { ok, restaurantId },
        } = data;
        // 뮤테이션 성공 시
        if (ok) {
            // 현재 폼 값 가져오기
            const { name, categoryName, address, minimumPrice, deliveryFee } = getValues();
            // 업로딩 상태를 false로 설정 (업로딩 완료)
            setUploading(false);
            // 현재 캐시된 쿼리 결과 가져오기
            const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
            // 새로운 데이터로 쿼리 캐시 업데이트
            client.writeQuery({
                query: MY_RESTAURANTS_QUERY,
                data: {
                    myRestaurants: {
                        ...queryResult.myRestaurants,
                        restaurants: [
                            {
                                address,
                                category: {
                                    name: categoryName,
                                    __typename: "Category",
                                },
                                coverImg: imageUrl,
                                deliveryFee: deliveryFee,
                                id: restaurantId,
                                isPromoted: false,
                                minimumPrice: minimumPrice,
                                name,
                                __typename: "Restaurant",
                            },
                            ...queryResult.myRestaurants.restaurants,
                        ],
                    },
                },
            });
            // 홈으로 라우팅
            navigate("/");
        }
    };
    // CREATE_RESTAURANT_MUTATION을 실행하는 뮤테이션 훅 초기화
    const [createRestaurantMutation, { data }] = useMutation<
        CreateRestaurantMutation,
        CreateRestaurantMutationVariables
    >(CREATE_RESTAURANT_MUTATION, {
        onCompleted,
    });
    // 폼 관리를 위한 useForm 훅 사용
    const { register, getValues, formState, handleSubmit } = useForm<IFormProps>({
        mode: "onChange",  // 입력 필드가 변경될 때마다 폼 상태를 다시 검증
    });
    // 이미지 업로딩 상태
    const [uploading, setUploading] = useState(false);
    // 폼 제출 처리 함수
    const onSubmit = async () => {
        try {
            // 업로딩 시작
            setUploading(true);
            // 폼 데이터에서 파일 및 기타 필드 값 추출
            const { file, name, categoryName, address, minimumPrice, deliveryFee } = getValues();
            // 실제 파일 객체
            const actualFile = file[0];
            // FormData 객체 생성 및 파일 추가
            const formBody = new FormData();
            formBody.append("file", actualFile);
            // 이미지 업로드 요청 및 응답에서 이미지 URL 추출
            const { url: coverImg } = await (
                await fetch("https://coupang-eats-backend.onrender.com/uploads/", {
                    method: "POST",
                    body: formBody,
                })
            ).json();
            // 이미지 URL 상태 업데이트
            setImageUrl(coverImg);
            // 식당 생성 뮤테이션 실행
            createRestaurantMutation({
                variables: {
                    input: {
                        name,
                        categoryName,
                        address,
                        coverImg,
                        minimumPrice: +minimumPrice,
                        deliveryFee: +deliveryFee,
                    },
                },
            });
        } catch (e) {
            // 에러 처리 로직 (필요한 경우 추가)
        }
    };

    return (
        <div className="container flex flex-col items-center mt-32">
            <Helmet>
                <title>매장 만들기 | Coupang Eats</title>
            </Helmet>
            <h4 className="font-semibold text-2xl mb-3">매장 만들기</h4>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
            >
                <input
                    {...register("name", { required: "이름은 필수입니다." })}
                    className="input"
                    type="text"
                    name="name"
                    placeholder="매장 이름"
                />
                <input
                    {...register("address", { required: "주소는 필수입니다." })}
                    className="input"
                    type="text"
                    name="address"
                    placeholder="주소"
                />
                <input
                    {...register("categoryName", { required: "카테고리는 필수입니다." })}
                    className="input"
                    type="text"
                    name="categoryName"
                    placeholder="카테고리 분류"
                />
                <input
                    {...register("deliveryFee", { required: "배달비는 필수입니다." })}
                    className="input"
                    type="text"
                    name="deliveryFee"
                    placeholder="배달비"
                />
                <input
                    {...register("minimumPrice", { required: "최소주문금액은 필수입니다." })}
                    className="input"
                    type="text"
                    name="minimumPrice"
                    placeholder="최소 주문 금액"
                />
                <div>
                    <input
                        {...register("file", { required: true })}
                        type="file"
                        id="file"
                        name="file"
                        accept="image/*"
                        className="hidden"
                    />
                    <label
                        htmlFor='file' // 수정된 부분
                        className='flex flex-col items-center justify-center border border-gray-400 p-2 text-sm'
                    >
                        <BsCamera className='text-3xl' />
                        사진 추가
                    </label>
                </div>
                <Button
                    loading={uploading}
                    canClick={formState.isValid}
                    actionText="매장 만들기"
                />
                {data?.createRestaurant?.error && (
                    <FormError errorMessage={data.createRestaurant.error} />
                )}
            </form>
        </div>
    );
};