import { toast } from 'react-toastify';
import { CircleCheck } from 'lucide-react';

export default function toastSuccess({ message }: { message: string }) {
    return toast.success(
        <div>
            <p className='font-semibold text-base text-[#e8e8e8]'>{message}</p>
        </div>,
        {
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            icon: <CircleCheck size={30} />,
            position: "bottom-right",
            style: {
                backgroundColor: '#22c55e',
            },
        }
    )
}