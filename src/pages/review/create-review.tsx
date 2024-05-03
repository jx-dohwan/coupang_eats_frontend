import { useState } from 'react'
import { BsCamera, BsCheckCircleFill } from 'react-icons/bs'
import { StarRatingInput } from '../../components/star_rating_input'
import { gql, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateReviewInput, CreateReviewMutation, CreateReviewMutationVariables } from '../../__api__/graphql';
import { Controller, useForm } from 'react-hook-form';
import { MY_RESTAURANT_QUERY } from '../owner/my_restaurant';

// 매장 번호르 id를 보내기,
// 매장 번호에 맞는 review를 생성하기 

const CREATE_REVIEW_MUTATION = gql`
  mutation createReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      error
      ok
    }
  }
`;

interface TCreateReviewProps {
    id: string;
}

interface FormInput {
    score: number;
    reviewText?: string;
    reviewImg: FileList;
}
// interface는 확장 가능하며, 주로 객체의 형태를 정의하거나 클래스와의 상호 작용에 사용됩니다.
// type은 유연하고 다양한 타입을 정의하거나 기존 타입을 조합하는 데 사용됩니다. 하지만 확장은 불가능합니다.
export const CreateReview = () => {
    const navigate = useNavigate();
    const { id } = useParams() as unknown as TCreateReviewProps;;
    const [rating, setRating] = useState(5)

    const [createReviewMutation, { loading }] = useMutation<
        CreateReviewMutation,
        CreateReviewMutationVariables
    >(CREATE_REVIEW_MUTATION, {
        refetchQueries: [
            {
                query: MY_RESTAURANT_QUERY,
                variables: {
                    input: {
                        id: +id,
                    },
                },
            },
        ],
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        control,
    } = useForm<FormInput>({
        mode: "onChange",
        defaultValues: {
            score: 5, // 별점의 초기 값 설정
        }
    })
    return (
        <>
            <div className="pb-16 p-4">
                <div className="rounded-lg border border-gray-200 g-4 p-4">
                    <div className="relative grid place-items-center p-4 text-lg font-bold">
                        <div className="absolute left-4 top-0 flex h-full items-center">
                            {/* 여기에 추가적인 요소가 필요한 경우 추가 */}
                        </div>
                        만족도 평가 및 리뷰
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-1 grid justify-end text-4xl text-sky-500">
                            <BsCheckCircleFill />
                        </div>
                        <div className="col-span-10 grid gap-4 pr-4">
                            <h2 className='text-2xl font-bold'>
                                음식 평가
                            </h2>
                            <div className='text-lg'>
                                매장 이름
                                <div className='pt-1 text-lg text-yellow-400'>
                                    <Controller
                                        control={control}
                                        name="score"
                                        render={({ field }) => <StarRatingInput rating={field.value} setRating={field.onChange} />}
                                    />
                                </div>
                            </div>
                            <textarea
                                {...register("reviewText")}
                                placeholder="리뷰를 남겨주세요..."
                                className='p-2'
                                rows={5}
                            />
                            <div className='flex gap-2'>
                                <input
                                    {...register("reviewImg")}
                                    type="file"
                                    id="reviewImg"
                                    name="reviewImg"
                                    className='hidden'
                                />
                                <label
                                    htmlFor='reviewImg' // 수정된 부분
                                    className='flex flex-col items-center justify-center border border-gray-400 p-2 text-sm'
                                >
                                    <BsCamera className='text-3xl' />
                                    사진 추가
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button
                className="fixed bottom-0 flex h-20 w-screen items-center justify-center bg-sky-500 hover:bg-sky-600 pb-4 text-lg text-white"
            >
                등록하기
            </button>
        </>
    )
}