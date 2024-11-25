export interface Disease {
    name: string;
    hasSuffered: boolean;
    treatment: string;
}

export interface ExtraOralExam {
    head: string;
    face: string;
    atm: string;
    ganglios: string;
    lips: string;
}

export interface MedicalHistory {
    diseases: {
        [key: string]: Disease;
    };
    otherDiseases: string;
    extraOralExam: ExtraOralExam;
}