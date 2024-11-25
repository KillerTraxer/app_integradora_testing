import { ToothData } from '@/types/tooth';
import { ToothSVG } from '@/components/ui/tooth-svg';

interface ToothProps {
    tooth: ToothData;
    isSelected: boolean;
    onClick: () => void;
}

export function Tooth({ tooth, isSelected, onClick }: ToothProps) {
    const { number, position, conditions } = tooth;

    return (
        <div className="flex flex-col items-center">
            <div className="text-xs font-medium text-gray-600 mb-1">{number}</div>
            <button
                onClick={onClick}
                className={`w-8 h-12 relative ${isSelected ? 'ring-2 ring-blue-500' : ''
                    } ${!conditions.isPresent ? 'opacity-50' : ''}`}
                aria-label={`Tooth ${number} (${position})`}
            >
                <ToothSVG isUpper={position === 'upper'} />
                {/* Caries markers */}
                {conditions.caries.mesial && (
                    <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
                {conditions.caries.distal && (
                    <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
                {conditions.caries.oclusal && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
                {conditions.caries.vestibular && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}

                {/* Fracture marker */}
                {conditions.fracture && (
                    <div className="absolute inset-0 border-2 border-yellow-500" />
                )}

                {/* Malposition marker */}
                {conditions.malposition && (
                    <div className="absolute -right-1 -top-1 w-2 h-2 bg-purple-500 rounded-full" />
                )}
            </button>
        </div>
    );
}

