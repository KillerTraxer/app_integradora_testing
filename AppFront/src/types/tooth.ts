export interface ToothSurface {
    mesial: boolean;
    distal: boolean;
    oclusal: boolean;
    vestibular: boolean;
    lingual: boolean;
}

export interface ToothCondition {
    isPresent: boolean;
    caries: ToothSurface;
    fracture: boolean;
    malposition: boolean;
}

export interface ToothData {
    id: string;
    number: number;
    type: 'Molar' | 'Premolar' | 'Canine' | 'Incisor';
    position: 'upper' | 'lower';
    conditions: ToothCondition;
}

