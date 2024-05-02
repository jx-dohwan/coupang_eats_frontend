import { useState } from 'react'
import { BsCamera, BsCheckCircleFill } from 'react-icons/bs'
import { StarRatingInput } from '../../components/star_rating_input'

export const CreateReview = () => {
    const [rating, setRating] = useState(5)
    return (
        <>

            <div className="pb-16 p-4">
                <div className="rounded-lg border border-gray-200 g-4 p-4">
                    <div className="relative grid place-items-center p-4 text-lg font-bold">
                        <div className="absolute left-4 top-0 flex h-full items-center">

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
                                    <StarRatingInput rating={rating} setRating={setRating}/>
                                </div>
                            </div>
                            <textarea
                                placeholder="리뷰를 남겨주세요..."
                                className='p-2'
                                rows={5}

                            />
                            <div className='flex gap-2'>
                                <input
                                    type="file"
                                    id="reviewImg"
                                    name="reviewImg"
                                    className='hidden'
                                />
                                <label
                                    htmlFor='imageUpload'
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