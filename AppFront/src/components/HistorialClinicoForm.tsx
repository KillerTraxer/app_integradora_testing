import { Input, Checkbox, CheckboxGroup, DatePicker, Button, Textarea } from "@nextui-org/react"
import { useState, useRef } from "react"
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
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import useAuthStore from "@/store/authStore"
import { storage2, ref, uploadBytesResumable, getDownloadURL } from "@/utils/firebaseUtil";
import jsPDF from 'jspdf';

// Extend dayjs with plugins
dayjs.extend(utc)

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

export default function HistorialClinicoForm({ onCreateHistorial, pacienteInfo, onHide, motivo }: any) {
    const { theme } = useAuthStore()
    const nombreCompleto = pacienteInfo ? pacienteInfo.nombre ?? '' + ' ' + pacienteInfo.apellidos ?? '' : '';
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
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const pdfRef = useRef<HTMLDivElement>(null);

    const handleGenderChange = (value: string[]) => {
        setSelectedGender(value[0] || null);
        formik.setFieldValue('genero', value[0] || null);
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

    const formik = useFormik({
        initialValues: {
            nombreCompleto: nombreCompleto || "",
            edad: '',
            genero: '',
            fechaNacimiento: '',
            direccion: '',
            localidad: '',
            ocupacion: '',
            phone: pacienteInfo?.telefono || "",
            email: pacienteInfo?.email || "",
            diagnostico: '',
        },
        validationSchema: Yup.object({
            nombreCompleto: Yup.string().required('El nombre es requerido'),
            edad: Yup.string().required('La edad es requerida'),
            genero: Yup.string().required('El genero es requerido'),
            fechaNacimiento: Yup.date().required('La fecha de nacimiento es requerida'),
            direccion: Yup.string().required('La direccion es requerida'),
            localidad: Yup.string().required('La localidad es requerida'),
            ocupacion: Yup.string().required('La ocupación es requerida'),
            phone: Yup.string().matches(/^\d{10}$/, 'El teléfono debe tener 10 dígitos').required('El teléfono es requerido'),
            email: Yup.string().email('Correo electrónico inválido').required('El correo electrónico es requerido'),
            diagnostico: Yup.string().required('El diagnostico es requerido'),
        }),

        //@ts-ignore
        onSubmit: async (values) => {
            setLoading(true);
            setSubmitStatus(null);

            const formattedValues = {
                ...values,
                fechaNacimiento: values.fechaNacimiento ? dayjs.utc(values.fechaNacimiento).format('DD-MM-YYYY') : null
            };

            try {
                await axiosInstanceWithAuth.post(`/historiasClinicas`, {
                    paciente: pacienteInfo?._id,
                    ...formattedValues,
                    diseases: medicalHistory.diseases,
                    otherDiseases: medicalHistory.otherDiseases,
                    odontogram: teeth,
                    extraOralExam: medicalHistory.extraOralExam
                });

                formik.resetForm();
                toastSuccess({ message: 'Historial clínico creado exitosamente' });
                setIsDialogOpen(true);
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

    const handleNoSendHistorial = () => {
        setIsDialogOpen(false);
        onHide();
        onCreateHistorial();
    }

    const handleSendHistorial = async () => {
        await createAndSavePdf();
        setIsDialogOpen(false);
        onHide();
        onCreateHistorial();
    }

    //@ts-ignore
    const generatePdf = (data: any) => {
        const doc = new jsPDF();

        doc.text('Historial Clínico', 100, 50);

        // Añade más contenido según sea necesario

        return doc;
    };

    const createAndSavePdf = async () => {
        if (!pdfRef.current) return;

        const pdf = generatePdf(pdfRef.current.innerHTML);

        const fileBlob = pdf.output('blob');
        const file = new Blob([fileBlob], { type: 'application/pdf' });

        const storageApp = storage2;
        const storageRef = ref(storageApp, `historiales/${pacienteInfo?._id}.pdf`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.error("Error uploading file:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    // sendEmail(downloadURL);
                });
            }
        );
    };

    return (
        <div className="pb-8" ref={pdfRef}>
            <div className="flex flex-row gap-4">
                <h1 className='text-2xl font-semibold mb-4'>Historia clinica general de odontología</h1>

                <Button color="danger" variant="flat" onClick={onHide}>Volver</Button>
                <Button
                    color="primary"
                    variant="flat"
                    onClick={() => formik.submitForm()}
                    isLoading={loading}
                >
                    Crear
                </Button>
            </div>

            {submitStatus && (
                <p className={`mt-4 ${submitStatus.includes('Error') ? 'text-danger' : 'text-success'}`}>
                    {submitStatus}
                </p>
            )}

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
                            isInvalid={formik.touched["genero" as keyof typeof formik.touched] && !!formik.errors["genero" as keyof typeof formik.errors]}
                            //@ts-ignore
                            errorMessage={formik.touched["genero" as keyof typeof formik.touched] && formik.errors["genero" as keyof typeof formik.errors]}
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
                            isInvalid={formik.touched["fechaNacimiento" as keyof typeof formik.touched] && !!formik.errors["fechaNacimiento" as keyof typeof formik.errors]}
                            //@ts-ignore
                            errorMessage={formik.touched["fechaNacimiento" as keyof typeof formik.touched] && formik.errors["fechaNacimiento" as keyof typeof formik.errors]}
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
                    isInvalid={formik.touched["direccion" as keyof typeof formik.touched] && !!formik.errors["direccion" as keyof typeof formik.errors]}
                    //@ts-ignore
                    errorMessage={formik.touched["direccion" as keyof typeof formik.touched] && formik.errors["direccion" as keyof typeof formik.errors]}
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
                        isInvalid={formik.touched["localidad" as keyof typeof formik.touched] && !!formik.errors["localidad" as keyof typeof formik.errors]}
                        //@ts-ignore
                        errorMessage={formik.touched["localidad" as keyof typeof formik.touched] && formik.errors["localidad" as keyof typeof formik.errors]}
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
                        isInvalid={formik.touched["ocupacion" as keyof typeof formik.touched] && !!formik.errors["ocupacion" as keyof typeof formik.errors]}
                        //@ts-ignore
                        errorMessage={formik.touched["ocupacion" as keyof typeof formik.touched] && formik.errors["ocupacion" as keyof typeof formik.errors]}
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
                        value={formik.values["email" as keyof typeof formik.values]}
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
                    labelPlacement="outside"
                    label="Motivo de la consulta"
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

                <h2 className='font-semibold text-xl mb-2'>Diagnostico</h2>
                <Textarea
                    id='diagnostico'
                    name='diagnostico'
                    labelPlacement="outside"
                    placeholder="Escribe el diagnostico"
                    value={formik.values["diagnostico" as keyof typeof formik.values]}
                    classNames={{
                        base: "w-full",
                        input: "resize-y min-h-[80px]",
                    }}
                    onChange={formik.handleChange}
                    onBlur={(e) => {
                        formik.handleBlur(e);
                        setFocusedField(null);
                    }}
                    rows={4}
                    color={focusedField === "diagnostico" ? "primary" : "default"}
                    onFocus={() => setFocusedField('diagnostico')}
                    isInvalid={formik.touched["diagnostico" as keyof typeof formik.touched] && !!formik.errors["diagnostico" as keyof typeof formik.errors]}
                    //@ts-ignore
                    errorMessage={formik.touched["diagnostico" as keyof typeof formik.touched] && formik.errors["diagnostico" as keyof typeof formik.errors]}
                />

                <Button
                    color="primary"
                    onClick={() => formik.submitForm()}
                    isLoading={loading}
                    variant="flat"
                    className="w-full"
                >
                    Guardar historial clínico
                </Button>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className={`${theme === "dark" ? "bg-[#121e2d]" : "bg-[#fff]"} border-0`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Deseas mandar el historial clínico al paciente?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button color="danger" onClick={handleNoSendHistorial}>
                            No
                        </Button>
                        <Button color="primary" variant="flat" isLoading={loading} onClick={handleSendHistorial}>
                            Si, mandar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
