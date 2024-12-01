import { Card, CardBody, CardHeader, Switch } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { ToothData } from "@/types/tooth";

interface ControlPanelProps {
    selectedTooth: ToothData | null;
    onUpdateTooth: (toothId: string, updates: Partial<ToothData['conditions']>) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function ControlPanel({ selectedTooth, onUpdateTooth, isOpen, onClose }: ControlPanelProps) {
    return (
        <AnimatePresence>
            {isOpen && selectedTooth && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 right-0 h-full w-80 z-50"
                >
                    <Card className="h-full">
                        <CardHeader className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold">Diente {selectedTooth.number}</h4>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </CardHeader>
                        <CardBody className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span>Presente</span>
                                <Switch
                                    isSelected={selectedTooth.conditions.isPresent}
                                    onValueChange={(isChecked) =>
                                        onUpdateTooth(selectedTooth.id, { isPresent: isChecked })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <span className="text-sm font-medium">Caries</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(selectedTooth.conditions.caries).map(([surface, value]) => (
                                        <div key={surface} className="flex justify-between items-center">
                                            <span className="capitalize">{surface}</span>
                                            <Switch
                                                size="sm"
                                                isSelected={value}
                                                onValueChange={(selected) =>
                                                    onUpdateTooth(selectedTooth.id, {
                                                        caries: { ...selectedTooth.conditions.caries, [surface]: selected },
                                                    })
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span>Fractura</span>
                                <Switch
                                    isSelected={selectedTooth.conditions.fracture}
                                    onValueChange={(selected) =>
                                        onUpdateTooth(selectedTooth.id, { fracture: selected })
                                    }
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <span>Mala posición</span>
                                <Switch
                                    isSelected={selectedTooth.conditions.malposition}
                                    onValueChange={(selected) =>
                                        onUpdateTooth(selectedTooth.id, { malposition: selected })
                                    }
                                />
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}