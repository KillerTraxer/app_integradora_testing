import { toast } from 'react-toastify';
import { CircleX } from 'lucide-react';

export default function toastError({ message, secondaryMessage }: { message: string, secondaryMessage?: string }) {
    return toast.error(
        <div>
            <p className='font-semibold text-base text-[#e8e8e8]'>{message}</p>
            {secondaryMessage && <p className='font-normal text-sm text-[#e8e8e8]'>{secondaryMessage}</p>}
        </div>,
        {
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            icon: <CircleX size={30} />,
            position: "bottom-right",
            style: {
                backgroundColor: '#a13c4f',
            }
        }
    )
}
