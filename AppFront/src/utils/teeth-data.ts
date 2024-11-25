import { ToothData } from '@/types/tooth';

export const initialTeethData: ToothData[] = [
    // Upper teeth (18-28)
    { id: '18', number: 18, type: 'Molar', position: 'upper', conditions: createInitialConditions() },
    { id: '17', number: 17, type: 'Molar', position: 'upper', conditions: createInitialConditions() },
    { id: '16', number: 16, type: 'Molar', position: 'upper', conditions: createInitialConditions() },
    { id: '15', number: 15, type: 'Premolar', position: 'upper', conditions: createInitialConditions() },
    { id: '14', number: 14, type: 'Premolar', position: 'upper', conditions: createInitialConditions() },
    { id: '13', number: 13, type: 'Canine', position: 'upper', conditions: createInitialConditions() },
    { id: '12', number: 12, type: 'Incisor', position: 'upper', conditions: createInitialConditions() },
    { id: '11', number: 11, type: 'Incisor', position: 'upper', conditions: createInitialConditions() },
    { id: '21', number: 21, type: 'Incisor', position: 'upper', conditions: createInitialConditions() },
    { id: '22', number: 22, type: 'Incisor', position: 'upper', conditions: createInitialConditions() },
    { id: '23', number: 23, type: 'Canine', position: 'upper', conditions: createInitialConditions() },
    { id: '24', number: 24, type: 'Premolar', position: 'upper', conditions: createInitialConditions() },
    { id: '25', number: 25, type: 'Premolar', position: 'upper', conditions: createInitialConditions() },
    { id: '26', number: 26, type: 'Molar', position: 'upper', conditions: createInitialConditions() },
    { id: '27', number: 27, type: 'Molar', position: 'upper', conditions: createInitialConditions() },
    { id: '28', number: 28, type: 'Molar', position: 'upper', conditions: createInitialConditions() },

    // Lower teeth (48-38)
    { id: '48', number: 48, type: 'Molar', position: 'lower', conditions: createInitialConditions() },
    { id: '47', number: 47, type: 'Molar', position: 'lower', conditions: createInitialConditions() },
    { id: '46', number: 46, type: 'Molar', position: 'lower', conditions: createInitialConditions() },
    { id: '45', number: 45, type: 'Premolar', position: 'lower', conditions: createInitialConditions() },
    { id: '44', number: 44, type: 'Premolar', position: 'lower', conditions: createInitialConditions() },
    { id: '43', number: 43, type: 'Canine', position: 'lower', conditions: createInitialConditions() },
    { id: '42', number: 42, type: 'Incisor', position: 'lower', conditions: createInitialConditions() },
    { id: '41', number: 41, type: 'Incisor', position: 'lower', conditions: createInitialConditions() },
    { id: '31', number: 31, type: 'Incisor', position: 'lower', conditions: createInitialConditions() },
    { id: '32', number: 32, type: 'Incisor', position: 'lower', conditions: createInitialConditions() },
    { id: '33', number: 33, type: 'Canine', position: 'lower', conditions: createInitialConditions() },
    { id: '34', number: 34, type: 'Premolar', position: 'lower', conditions: createInitialConditions() },
    { id: '35', number: 35, type: 'Premolar', position: 'lower', conditions: createInitialConditions() },
    { id: '36', number: 36, type: 'Molar', position: 'lower', conditions: createInitialConditions() },
    { id: '37', number: 37, type: 'Molar', position: 'lower', conditions: createInitialConditions() },
    { id: '38', number: 38, type: 'Molar', position: 'lower', conditions: createInitialConditions() },
];

function createInitialConditions() {
    return {
        isPresent: true,
        caries: {
            mesial: false,
            distal: false,
            oclusal: false,
            vestibular: false,
            lingual: false,
        },
        fracture: false,
        malposition: false,
    };
}

