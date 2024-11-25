import { Input } from "@nextui-org/react";
import { ExtraOralExam } from "@/types/medical-history";

interface ExtraOralExamFormProps {
    exam: ExtraOralExam;
    onChange: (updates: Partial<ExtraOralExam>) => void;
}

export function ExtraOralExamForm({ exam, onChange }: ExtraOralExamFormProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Examen extraoral:</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap">Cabeza:</span>
                    <Input
                        size="sm"
                        value={exam.head}
                        onChange={(e) => onChange({ head: e.target.value })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap">Cara:</span>
                    <Input
                        size="sm"
                        value={exam.face}
                        onChange={(e) => onChange({ face: e.target.value })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap">ATM:</span>
                    <Input
                        size="sm"
                        value={exam.atm}
                        onChange={(e) => onChange({ atm: e.target.value })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap">Ganglios:</span>
                    <Input
                        size="sm"
                        value={exam.ganglios}
                        onChange={(e) => onChange({ ganglios: e.target.value })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap">Labios:</span>
                    <Input
                        size="sm"
                        value={exam.lips}
                        onChange={(e) => onChange({ lips: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}

