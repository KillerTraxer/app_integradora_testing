import { Input, Checkbox, CheckboxGroup, DatePicker, Button, Textarea } from "@nextui-org/react"
import { useState } from "react"
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axiosInstanceWithAuth from "@/utils/axiosInstanceWithAuth"
import toastSuccess from "@/components/ui/toastSuccess";
import { DiseaseForm } from "@/components/disease-form"
import { ExtraOralExamForm } from "@/components/extra-oral-exam"
import { Disease, ExtraOralExam, MedicalHistory } from "@/types/medical-history"
import { Odontogram } from "@/components/odontogram"
import { ToothData } from "@/types/tooth"
import { initialTeethData } from "@/utils/teeth-data"

const initialDiseases = [
    "Epilepsia o Convulsiones",
    "Anemia",
    "Hiper o Hipotiroidismo",
    "Infarto al miocardio",
    "Asma",
    "Insuficiencia renal",
    "H.I.V. / SIDA",
    "Embarazo",
    "Cáncer",
    "Diabetes",
    "Hepatitis",
    "Hipertensión",
    "Angina de pecho",
    "Tuberculosis",
    "Enfermedades venéreas",
    "Gastritis",
    "Menopausia"
].reduce((acc, name) => ({
    ...acc,
    [name]: { name, hasSuffered: false, treatment: "" }
}), {});

const initialExtraOralExam: ExtraOralExam = {
    head: "",
    face: "",
    atm: "",
    ganglios: "",
    lips: ""
};

export default function HistorialClinicoForm({ pacienteInfo, onHide, motivo }: any) {
    const nombreCompleto = pacienteInfo?.nombre + ' ' + pacienteInfo?.apellidos
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null)
    const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
        diseases: initialDiseases,
        otherDiseases: "",
        extraOralExam: initialExtraOralExam
    });
    const [teeth, setTeeth] = useState<ToothData[]>(initialTeethData);
    const [diagnostico, setDiagnostico] = useState('');

    console.log(loading, submitStatus);

    const handleGenderChange = (value: string[]) => {
        setSelectedGender(value[0] || null);
    };

    const handleDiseaseChange = (name: string, updates: Partial<Disease>) => {
        setMedicalHistory(prev => ({
            ...prev,
            diseases: {
                ...prev.diseases,
                [name]: {
                    ...prev.diseases[name],
                    ...updates
                }
            }
        }));
    };

    const handleOtherDiseasesChange = (value: string) => {
        setMedicalHistory(prev => ({
            ...prev,
            otherDiseases: value
        }));
    };

    const handleExtraOralExamChange = (updates: Partial<ExtraOralExam>) => {
        setMedicalHistory(prev => ({
            ...prev,
            extraOralExam: {
                ...prev.extraOralExam,
                ...updates
            }
        }));
    };

    const handleToothUpdate = (toothId: string, updates: Partial<ToothData['conditions']>) => {
        setTeeth((currentTeeth) =>
            currentTeeth.map((tooth) =>
                tooth.id === toothId
                    ? { ...tooth, conditions: { ...tooth.conditions, ...updates } }
                    : tooth
            )
        );
    };

    const handleSaveInfo = () => {
        const info = {
            diseases: medicalHistory.diseases,
            otherDiseases: medicalHistory.otherDiseases,
            odontogram: teeth,
            extraOralExam: medicalHistory.extraOralExam
        };
        console.log("Información médica guardada:", JSON.stringify(info, null, 2));
    };

    const formik = useFormik({
        initialValues: {
            nombreCompleto: nombreCompleto,
            edad: '',
            genero: '',
            fechaNacimiento: '',
            direccion: '',
            localidad: '',
            ocupacion: '',
            phone: pacienteInfo?.telefono,
            email: pacienteInfo?.email,
        },
        validationSchema: Yup.object({
            nombreCompleto: Yup.string().required('El nombre es requerido'),
            edad: Yup.number().required('La edad es requerida'),
            genero: Yup.string().required('El genero es requerido'),
            fechaNacimiento: Yup.date().required('La fecha de nacimiento es requerida'),
            phone: Yup.string().matches(/^\d{10}$/, 'El teléfono debe tener 10 dígitos').required('El teléfono es requerido'),
        }),

        //@ts-ignore
        onSubmit: async (values) => {
            setLoading(true);
            setSubmitStatus(null);

            try {
                await axiosInstanceWithAuth.post(`/citas`, {
                    pacienteId: pacienteInfo?._id,
                });

                formik.resetForm();
                onHide();
                toastSuccess({ message: 'Historial clínico creado exitosamente' });
            } catch (error: any) {
                if (error.response && error.response.status === 400) {
                    const { errors } = error.response.data;

                    console.log(errors)
                } else {
                    setSubmitStatus("Error inesperado en el servidor. Por favor, intenta de nuevo más tarde.");
                }
            } finally {
                setLoading(false);
            }
        },
    });

    const getInputColor = (fieldName: string) => {
        if (focusedField === fieldName) {
            return formik.touched[fieldName as keyof typeof formik.touched] && formik.errors[fieldName as keyof typeof formik.errors] ? "danger" : "primary";
        }
        return "default";
    }

    return (
        <div className="pb-8">
            <div className="flex flex-row gap-4">
                <h1 className='text-2xl font-semibold mb-4'>Historia clinica general de odontología</h1>

                <Button color="danger" variant="flat" onClick={onHide}>Volver</Button>
                <Button color="primary" variant="flat">Crear</Button>
            </div>

            <h2 className='font-semibold text-xl mb-4'>Datos personales del paciente</h2>

            <div className="space-y-5">
                <Input
                    id='nombreCompleto'
                    name='nombreCompleto'
                    label="Nombre completo"
                    placeholder="Escribe el nombre del paciente."
                    value={formik.values["nombreCompleto" as keyof typeof formik.values]}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                        formik.handleBlur(e);
                        setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField('nombreCompleto')}
                    color={getInputColor('nombreCompleto')}
                    isInvalid={formik.touched["nombreCompleto" as keyof typeof formik.touched] && !!formik.errors["nombreCompleto" as keyof typeof formik.errors]}
                    //@ts-ignore
                    errorMessage={formik.touched["nombreCompleto" as keyof typeof formik.touched] && formik.errors["nombreCompleto" as keyof typeof formik.errors]}
                />

                <div className='flex flex-row flex-wrap gap-4 items-center'>
                    <div className="w-32">
                        <Input
                            id="edad"
                            name="edad"
                            label="Edad"
                            type="number"
                            value={formik.values["edad" as keyof typeof formik.values]}
                            onChange={formik.handleChange}
                            onBlur={(e) => {
                                formik.handleBlur(e);
                                setFocusedField(null);
                            }}
                            onFocus={() => setFocusedField('edad')}
                            color={getInputColor('edad')}
                            isInvalid={formik.touched["edad" as keyof typeof formik.touched] && !!formik.errors["edad" as keyof typeof formik.errors]}
                            //@ts-ignore
                            errorMessage={formik.touched["edad" as keyof typeof formik.touched] && formik.errors["edad" as keyof typeof formik.errors]}
                        />
                    </div>

                    <div className="flex flex-row gap-4 w-fit">
                        <p>Genero:</p>
                        <CheckboxGroup
                            orientation="horizontal"
                            value={selectedGender ? [selectedGender] : []}
                            onValueChange={handleGenderChange}
                        >
                            <Checkbox value="Masculino" >
                                Masculino
                            </Checkbox>

                            <Checkbox value="Femenino" aria-hidden>
                                Femenino
                            </Checkbox>
                        </CheckboxGroup>
                    </div>

                    <div className="w-full max-w-[284px]">
                        <DatePicker
                            showMonthAndYearPickers
                            label="Fecha de nacimiento"
                            onChange={(e) => formik.setFieldValue('fechaNacimiento', e)}
                            color={getInputColor('fechaNacimiento')}
                        />
                    </div>
                </div>

                <Input
                    id='direccion'
                    name='direccion'
                    label="Dirección"
                    placeholder="Escribe la dirección del paciente."
                    type="text"
                    value={formik.values["direccion" as keyof typeof formik.values]}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                        formik.handleBlur(e);
                        setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField('direccion')}
                    color={getInputColor('direccion')}
                />

                <div className="flex flex-row gap-4">
                    <Input
                        id='localidad'
                        name='localidad'
                        label="Ciudad, estado y/o municipio"
                        placeholder="Escribe la localidad del paciente."
                        type="text"
                        value={formik.values["localidad" as keyof typeof formik.values]}
                        onChange={formik.handleChange}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                            setFocusedField(null);
                        }}
                        onFocus={() => setFocusedField('localidad')}
                        color={getInputColor('localidad')}
                    />

                    <Input
                        id="ocupacion"
                        name='ocupacion'
                        label="Ocupación"
                        placeholder="Escribe la ocupación del paciente."
                        type="text"
                        value={formik.values["ocupacion" as keyof typeof formik.values]}
                        onChange={formik.handleChange}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                            setFocusedField(null);
                        }}
                        onFocus={() => setFocusedField('ocupacion')}
                        color={getInputColor('ocupacion')}
                    />
                </div>

                <div className="flex flex-row gap-4">
                    <Input
                        id='phone'
                        name='phone'
                        label="Número de teléfono"
                        placeholder="Escribe el número de teléfono del paciente."
                        value={formik.values["phone" as keyof typeof formik.values]}
                        onChange={formik.handleChange}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                            setFocusedField(null);
                        }}
                        onFocus={() => setFocusedField('phone')}
                        color={getInputColor('phone')}
                        isInvalid={formik.touched["phone" as keyof typeof formik.touched] && !!formik.errors["phone" as keyof typeof formik.errors]}
                        //@ts-ignore
                        errorMessage={formik.touched["phone" as keyof typeof formik.touched] && formik.errors["phone" as keyof typeof formik.errors]}
                    />

                    <Input
                        id="email"
                        name='email'
                        label="Email (opcional)"
                        placeholder="Escribe el email del paciente."
                        type="email"
                        value={pacienteInfo?.email}
                        onChange={formik.handleChange}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                            setFocusedField(null);
                        }}
                        onFocus={() => setFocusedField('email')}
                        color={getInputColor("email")}
                        isInvalid={formik.touched["email" as keyof typeof formik.touched] && !!formik.errors["email" as keyof typeof formik.errors]}
                        //@ts-ignore
                        errorMessage={formik.touched["email" as keyof typeof formik.touched] && formik.errors["email" as keyof typeof formik.errors]}
                    />
                </div>

                <Textarea
                    id='motivoConsulta'
                    name='motivoConsulta'
                    value={motivo}
                    classNames={{
                        base: "w-full",
                        input: "resize-y min-h-[80px] cursor-default",
                    }}
                    readOnly
                />

                <DiseaseForm
                    diseases={medicalHistory.diseases}
                    onChange={handleDiseaseChange}
                    onOtherDiseasesChange={handleOtherDiseasesChange}
                    otherDiseases={medicalHistory.otherDiseases}
                />

                <Odontogram
                    //@ts-ignore
                    teeth={teeth}
                    onUpdateTooth={handleToothUpdate}
                />

                <ExtraOralExamForm
                    exam={medicalHistory.extraOralExam}
                    onChange={handleExtraOralExamChange}
                />

                <Textarea
                    id='diagnostico'
                    name='diagnostico'
                    label={(<p className="text-gray-400 font-semibold text-xl">Diagnostico y tratamiento a realizar</p>)}
                    labelPlacement="outside"
                    placeholder="Escribe el diagnostico y tratamiento a realizar."
                    value={diagnostico}
                    classNames={{
                        base: "w-full",
                        input: "resize-y min-h-[80px]",
                    }}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    onBlur={() => {
                        setFocusedField(null);
                    }}
                    rows={4}
                    color={focusedField === "diagnostico" ? "primary" : "default"}
                    onFocus={() => setFocusedField('diagnostico')}
                />

                <Button color="primary" onClick={handleSaveInfo} variant="flat" className="w-full">
                    Crear historial
                </Button>
            </div>
        </div>
    )
}
