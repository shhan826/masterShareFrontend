import CookieImg from "@/components/cookieImg";
import Image from "next/image";

export default function RevealItem ()
{
    return(
        <div>
            <div className='absolute w-full h-full flex flex-col justify-center items-center'>
                <Image
                    aria-hidden
                    src="/mainImage.png"
                    alt="main image"
                    width={400}
                    height={400}
                />
                <button className='mx-3 btn btn-secondary'>공유하기</button>
            </div>
            <div className='absolute flex flex-col justify-center items-center w-full h-screen z-1'>
                <div className='bg-white w-5/6 h-16 flex flex-col justify-center rounded-md shadow-xl'>
                    <div className="text-center resize-none w-full outline-none h-7 text-lg">
                        받은 메시지가 여기에 보여집니다.
                    </div> 
                </div>
                <br/>
            </div>
        </div>
    );
}