import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci'

export const Menu = () => {
    return (
        <>
            <div className="border-b border-b-gray-100 p-4 pb-8">
                <h1 className="text-2xl font-bold">제목</h1>
                {/* {description && <p className="text-sm text-gray-700">설명</p>} */}
            </div>
            <div className="pb-20">
                <div className="p-4">
                    <div className="flex justify-between pb-4">
                        <div className="flex items-center">
                            <p className="text-lg font-semibold">가격</p>
                        </div>
                        <div className="flex items-center">
                            <p className="text-lg">가격 입력</p>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <p className="text-lg font-semibold">수량</p> {/*수량 올리면 extra도 자동으로 올라가고, 해당 추가 옵션이 선택되어야 함*/}
                        </div>
                        <div className="flex items-center gap-2">
                            <CiCircleMinus
                                className="text-4xl text-gray-400"
                            //   onClick={decrementCount}
                            />
                            <p className="text-lg">주문 수량</p>
                            <CiCirclePlus
                                className="text-4xl text-gray-400"
                            //   onClick={incrementCount}
                            />
                        </div>
                    </div>
                </div>

            </div>
            <button
                className="fixed bottom-0 flex h-20 w-screen items-center justify-center bg-sky-500 pb-4 text-lg text-white"
            //   onClick={addToCart}
            >
                결제하기
            </button>
        </>
    );
}