import React from 'react';

interface ToothSVGProps {
    isUpper: boolean;
}

export const ToothSVG: React.FC<ToothSVGProps> = ({ isUpper }) => {
    return (
        <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>{isUpper ? 'Upper Tooth' : 'Lower Tooth'}</title>
            {isUpper ? (
                // Upper tooth shape
                <path
                    d="M16 2 L2 10 V36 L16 46 L30 36 V10 L16 2Z"
                    stroke="black"
                    strokeWidth="2"
                    fill="white"
                />
            ) : (
                // Lower tooth shape
                <path
                    d="M16 46 L2 38 V12 L16 2 L30 12 V38 L16 46Z"
                    stroke="black"
                    strokeWidth="2"
                    fill="white"
                />
            )}
        </svg>
    );
};

