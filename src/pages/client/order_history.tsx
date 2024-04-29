import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { BiSearch } from 'react-icons/bi'
export const OrderHistory = () => {
    return (
        <div className="pb-16">
            <div className="flex flex-row border-b-8 border-b-gray-100 p-4">
                <input
                    className="flex-grow rounded-lg bg-gray-200 px-3"
                    placeholder="주문한 메뉴 혹은 매장 찾아보기"
                >
                </input>
                <BiSearch className="m-2 text-2xl" />
            </div>
            {/* map으로 감싸줘야함 */}
            <div className="grid gap-2 p-4">
                <div className="rounded-lg border border-gray-200 g-4">
                    <div className="flex flex-row pb-2">
                        <div className="flex flex-grow flex-col">
                            <div className="text-ellipsis text-xl font-bold">
                                매장 이름
                            </div>
                            <div className="pb-1 text-sm text-gray-500">
                                주문 일자
                            </div>
                            <div>주문 상태</div>
                        </div>
                    </div>
                    <ul className="grid gap-2 pl-2">
                        <span className="align-center inline-block h-6 w-6 rounded-full bg-gray-200 text-center">
                            번호
                        </span>
                        &nbsp; 메뉴이름
                        주문갯수
                        <ul className="pl-4 pt-1">
                            <li>추가 옵션</li>
                        </ul>
                    </ul>
                    <div className="pb-4 pt-2">합계:50000원</div>
                    <div className="grid place-items-center rounded-lg border border-sky-400 py-2 font-bold text-blue-400">
                        리뷰 작성
                    </div>
                    
                </div>
                <div className="grid place-items-center rounded-lg border border-sky-400 py-2 font-bold text-blue-400">
                        <Link to="/edit-profile"> {/*여기에 바로 edit을 만들지 말고, 주문내역 및 리뷰달기를 할 수 있도록 추가 즉 주문내역리스트에 각각의 내역에 리뷰달기 및 맨 마지막에 edit으로 이동하기를 해야한다 */}
                            <FontAwesomeIcon icon={faUser} className="text-3xl" />
                        </Link>
                    </div>
            </div>
        </div>

    )
}