export default function CloseX ()
{
    const closeXString = String.fromCharCode(parseInt('d7', 16));
    const moveBack = () => {
        history.back();
    };
    
    return(
        <div className='absolute w-full text-right z-2'>
          <button className='m-4 text-slate-400 text-4xl' onClick={moveBack}>{closeXString}</button>
        </div>
    );
}