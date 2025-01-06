import { redirect } from 'next/navigation'

interface CloseProps {
    backURL: string
}

export default function CloseX (props: CloseProps)
{
    const closeXString = String.fromCharCode(parseInt('d7', 16));
    const moveBack = () => {
        redirect(props.backURL);
    };
    
    return(
        <div className='absolute w-full text-right z-2'>
          <button className='m-4 text-slate-400 text-4xl' onClick={moveBack}>{closeXString}</button>
        </div>
    );
}