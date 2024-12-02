import { Input, Checkbox, CheckboxGroup, DatePicker, Button, Textarea, Progress } from "@nextui-org/react"
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
import html2canvas from "html2canvas";
import { parseDate } from "@internationalized/date";

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

export default function HistorialClinicoForm({ fecha, hasHistorial, onCreateHistorial, pacienteInfo, onHide, motivo }: any) {
    const { theme } = useAuthStore()
    const nombreCompleto = pacienteInfo ? pacienteInfo.nombre ?? '' + ' ' + pacienteInfo.apellidos ?? '' : '';
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null)
    const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
        diseases: hasHistorial?.diseases || initialDiseases,
        otherDiseases: hasHistorial?.otherDiseases || "",
        extraOralExam: hasHistorial?.extraOralExam || initialExtraOralExam,
    });
    const [teeth, setTeeth] = useState<ToothData[]>(hasHistorial?.odontogram || initialTeethData);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const pdfRef = useRef(null);
    const diseasesRef = useRef(null);
    const odontogramRef = useRef(null);
    const extraOralRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [downloadLink, setDownloadLink] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

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
            nombreCompleto: nombreCompleto || hasHistorial?.nombreCompleto || "",
            edad: hasHistorial?.edad || "",
            genero: hasHistorial?.genero || "",
            fechaNacimiento: fecha ? parseDate(fecha) : "",
            direccion: hasHistorial?.direccion || "",
            localidad: hasHistorial?.localidad || "",
            ocupacion: hasHistorial?.ocupacion || "",
            phone: pacienteInfo?.telefono || hasHistorial?.phone || "",
            email: pacienteInfo?.email || hasHistorial?.email || "",
            diagnostico: hasHistorial?.diagnostico || "",
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
                fechaNacimiento: values.fechaNacimiento
            };

            if (hasHistorial) {
                try {
                    await axiosInstanceWithAuth.put(`/historiasClinicas/${hasHistorial._id}`, {
                        paciente: pacienteInfo?._id,
                        ...formattedValues,
                        diseases: medicalHistory.diseases,
                        otherDiseases: medicalHistory.otherDiseases,
                        odontogram: teeth,
                        extraOralExam: medicalHistory.extraOralExam
                    })

                    setIsDialogOpen(true);
                    await createAndSavePdf();
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
            } else {
                try {
                    await axiosInstanceWithAuth.post(`/historiasClinicas`, {
                        paciente: pacienteInfo?._id,
                        ...formattedValues,
                        diseases: medicalHistory.diseases,
                        otherDiseases: medicalHistory.otherDiseases,
                        odontogram: teeth,
                        extraOralExam: medicalHistory.extraOralExam
                    });

                    setIsDialogOpen(true);
                    await createAndSavePdf();
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
            }
        },
    });

    const getInputColor = (fieldName: string) => {
        if (focusedField === fieldName) {
            return formik.touched[fieldName as keyof typeof formik.touched] && formik.errors[fieldName as keyof typeof formik.errors] ? "danger" : "primary";
        }
        return "default";
    }

    const handleNoSendHistorial = async () => {
        setIsDialogOpen(false);
        onHide();
        onCreateHistorial();
    }

    const handleSendHistorial = async () => {
        await sendEmail(downloadLink);
    }

    //@ts-ignore
    const generatePdf = newFunction(formik, motivo, medicalHistory);

    const createAndSavePdf = async () => {
        if (!pdfRef.current) return;

        setIsUploading(true);

        //@ts-ignore
        const pdfBlob = await generatePdf(pdfRef.current.innerHTML);

        const storageApp = storage2;
        const storageRef = ref(storageApp, `historiales/${pacienteInfo?._id}.pdf`);

        const metadata = {
            contentType: 'application/pdf', // Asegura el tipo MIME
        };

        const uploadTask = uploadBytesResumable(storageRef, pdfBlob, metadata);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.error("Error uploading file:", error);
                setIsUploading(false);
            },
            async () => {
                if (uploadTask.snapshot.state === 'success') {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                        setDownloadLink(downloadURL);
                        setLoading(false);

                        toastSuccess({ message: 'Historial clínico creado exitosamente' });
                    } catch (error) {
                        console.error("Error getting download URL:", error);
                    } finally {
                        setIsUploading(false);
                    }
                }
            }
        );
    };

    const sendEmail = async (url: string) => {
        if (pacienteInfo?.email) {
            try {
                await axiosInstanceWithAuth.post(`historiasClinicas/setLink/${pacienteInfo?._id}`, {
                    email: pacienteInfo?.email,
                    downloadLink: url
                });
                setIsDialogOpen(false);
                onHide();
                onCreateHistorial();

                toastSuccess({ message: "Historial clínico enviado exitosamente" });
                setDownloadLink('')
            } catch (error) {
                console.error('Error sending email:', error);
            }
        } else {
            try {
                await axiosInstanceWithAuth.post(`auth/send-email-paciente`, {
                    email: formik.values.email,
                    downloadLink: url
                });
                setIsDialogOpen(false);
                onHide();
                onCreateHistorial();

                toastSuccess({ message: "Historial clínico enviado exitosamente" });
                setDownloadLink('')
            } catch (error) {
                console.error('Error sending email:', error);
            }
        }
    }

    return (
        <div className="pb-8" ref={pdfRef}>
            <div className="flex flex-row gap-4">
                <h1 className='text-2xl font-semibold mb-4'>Historia clinica general de odontología</h1>

                <Button color="danger" variant="flat" onClick={onHide} className="hidden-pdf">Volver</Button>
                <Button
                    color="primary"
                    variant="flat"
                    onClick={() => formik.submitForm()}
                    isLoading={loading}
                    className="hidden-pdf"
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
                            defaultValue={formik.values["fechaNacimiento" as keyof typeof formik.values]}
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
                <div>
                    <h2 className="text-xl font-semibold mb-2 hidden-pdf">
                        En el siguiente listado de enfermedades por favor marque si ha padecido alguna.
                    </h2>
                    <p className="text-base text-gray-600 hidden-pdf">
                        Si su respuesta es afirmativa por favor describa el tratamiento recibido.
                    </p>
                </div>

                <div id="diseases" ref={diseasesRef}>
                    <DiseaseForm
                        diseases={medicalHistory.diseases}
                        onChange={handleDiseaseChange}
                        onOtherDiseasesChange={handleOtherDiseasesChange}
                        otherDiseases={medicalHistory.otherDiseases}
                    />
                </div>

                <h2 className="text-xl font-semibold mb-4">Odontograma</h2>

                <div ref={odontogramRef} id="odontogram">
                    <Odontogram
                        //@ts-ignore
                        teeth={teeth}
                        onUpdateTooth={handleToothUpdate}
                    />
                </div>

                <div ref={extraOralRef}>
                    <ExtraOralExamForm
                        exam={medicalHistory.extraOralExam}
                        onChange={handleExtraOralExamChange}
                    />
                </div>

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
                    className="w-full hidden-pdf"
                >
                    Guardar historial clínico
                </Button>
            </div>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <AlertDialogContent className={`${theme === "dark" ? "bg-[#121e2d]" : "bg-[#fff]"} border-0 hidden-pdf`}>
                    {loading || isUploading ? (
                        <Progress
                            aria-label="Guardando..."
                            label="Guardando..."
                            size="md"
                            value={uploadProgress}
                            color="primary"
                            showValueLabel={true}
                            className="max-w-md"
                        />
                    ) : (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Deseas mandar el historial clínico al paciente?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <Button color="danger" onClick={handleNoSendHistorial} isLoading={isUploading}>
                                    No
                                </Button>
                                <Button color="primary" variant="flat" isLoading={isUploading} onClick={handleSendHistorial}>
                                    Si, mandar
                                </Button>
                            </AlertDialogFooter>
                        </>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

function newFunction(formik: any, motivo: any, medicalHistory: any) {
    //@ts-ignore
    return async (data: any) => {
        const originalDiv = document.getElementById("pdf-content")
        const clonedDiv = originalDiv?.cloneNode(true)

        //@ts-ignore
        clonedDiv?.querySelectorAll(".hidden-pdf").forEach((element: any) => {
            element.remove()
        })

        // Crear un contenedor para el contenido del PDF
        const container = document.createElement("div")
        container.style.display = "flex"
        container.style.flexDirection = "column" // Asegura que todo esté apilado verticalmente
        container.style.width = "100%"
        container.style.marginTop = "20px" // Espaciado para separar del contenido original
        container.style.paddingBottom = "20px"

        // Agrega un título que solo se vea en el PDF
        const tituloPdf = document.createElement("h1")
        tituloPdf.textContent = "HISTORIA CLINICA GENERAL DE ODONTOLOGÍA"
        tituloPdf.style.fontSize = "40px"
        tituloPdf.style.fontWeight = "bold"
        tituloPdf.style.marginTop = "20px"
        tituloPdf.style.color = "#0070c0"
        tituloPdf.style.textAlign = "center"
        container?.appendChild(tituloPdf)

        const subTitle = document.createElement("h1")
        subTitle.textContent = "ODONTOLOGÍA INTEGRAL & ORTODONCIA"
        subTitle.style.fontSize = "38px"
        subTitle.style.fontWeight = "bold"
        subTitle.style.marginTop = "10px"
        subTitle.style.color = "#000000"
        subTitle.style.textAlign = "center"
        container?.appendChild(subTitle)

        const cedula = document.createElement("h2")
        cedula.textContent = "CED. PROF. 2111786"
        cedula.style.fontSize = "30px"
        cedula.style.fontWeight = "bold"
        cedula.style.marginTop = "20px"
        cedula.style.color = "#000000"
        cedula.style.textAlign = "right"
        container?.appendChild(cedula)

        const datosPersonales = document.createElement("h2")
        datosPersonales.textContent = "DATOS PERSONALES DEL PACIENTE"
        datosPersonales.style.fontSize = "30px"
        datosPersonales.style.fontWeight = "bold"
        datosPersonales.style.marginTop = "20px"
        datosPersonales.style.color = "#0070c0"
        datosPersonales.style.textAlign = "left"
        container?.appendChild(datosPersonales)

        const nombre = document.createElement("p")
        nombre.textContent = `Nombre completo: ${formik.values.nombreCompleto}`
        nombre.style.fontSize = "28px"
        nombre.style.fontWeight = "normal"
        nombre.style.marginTop = "25px"
        nombre.style.color = "#000000"
        nombre.style.textAlign = "left"
        container?.appendChild(nombre)

        const fila = document.createElement("div")
        fila.style.display = "flex"
        fila.style.flexDirection = "row"
        // fila.style.justifyContent = "space-between";
        fila.style.marginTop = "25px"
        fila.style.gap = "250px"

        const edad = document.createElement("p")
        edad.textContent = `Edad: ${formik.values.edad}`
        edad.style.fontSize = "28px"
        edad.style.fontWeight = "normal"
        edad.style.color = "#000000"
        edad.style.textAlign = "left"
        fila.appendChild(edad)

        const genero = document.createElement("p")
        genero.textContent = `Genero: ${formik.values.genero}`
        genero.style.fontSize = "28px"
        genero.style.fontWeight = "normal"
        genero.style.color = "#000000"
        genero.style.textAlign = "left"
        fila.appendChild(genero)

        const fechaNacimiento = document.createElement("p")
        fechaNacimiento.textContent = `Fecha de nacimiento: ${dayjs.utc(formik.values.fechaNacimiento).format('DD-MM-YYYY')}`
        fechaNacimiento.style.fontSize = "28px"
        fechaNacimiento.style.fontWeight = "normal"
        fechaNacimiento.style.color = "#000000"
        fechaNacimiento.style.textAlign = "left"
        fila.appendChild(fechaNacimiento)

        container?.appendChild(fila)

        const direccion = document.createElement("p")
        direccion.textContent = `Dirección: ${formik.values.direccion}`
        direccion.style.fontSize = "28px"
        direccion.style.fontWeight = "normal"
        direccion.style.marginTop = "25px"
        direccion.style.color = "#000000"
        direccion.style.textAlign = "left"
        container?.appendChild(direccion)

        const fila2 = document.createElement("div")
        fila2.style.display = "flex"
        fila2.style.flexDirection = "row"
        // fila2.style.justifyContent = "space-between";
        fila2.style.marginTop = "5px"
        fila2.style.gap = "50px"

        const ciudad = document.createElement("p")
        ciudad.textContent = `Ciudad, estado (provincia) y/o municipio: ${formik.values.localidad}`
        ciudad.style.fontSize = "28px"
        ciudad.style.fontWeight = "normal"
        ciudad.style.marginTop = "25px"
        ciudad.style.color = "#000000"
        ciudad.style.textAlign = "left"
        fila2?.appendChild(ciudad)

        const ocupacion = document.createElement("p")
        ocupacion.textContent = `Ocupación: ${formik.values.ocupacion}`
        ocupacion.style.fontSize = "28px"
        ocupacion.style.fontWeight = "normal"
        ocupacion.style.marginTop = "25px"
        ocupacion.style.color = "#000000"
        ocupacion.style.textAlign = "left"
        fila2?.appendChild(ocupacion)

        container?.appendChild(fila2)

        const fila3 = document.createElement("div")
        fila3.style.display = "flex"
        fila3.style.flexDirection = "row"
        // fila3.style.justifyContent = "space-between";
        fila3.style.marginTop = "10px"
        fila3.style.gap = "50px"

        const phone = document.createElement("p")
        phone.textContent = `Numero de telefono movil: ${formik.values.phone}`
        phone.style.fontSize = "28px"
        phone.style.fontWeight = "normal"
        phone.style.marginTop = "25px"
        phone.style.color = "#000000"
        phone.style.textAlign = "left"
        fila3?.appendChild(phone)

        const email = document.createElement("p")
        email.textContent = `E-mail: ${formik.values.email}`
        email.style.fontSize = "28px"
        email.style.fontWeight = "normal"
        email.style.marginTop = "25px"
        email.style.color = "#000000"
        email.style.textAlign = "left"
        fila3?.appendChild(email)

        container?.appendChild(fila3)

        const motivoCitaTitle = document.createElement("h2")
        motivoCitaTitle.textContent = "Motivo de la visita al dentista"
        motivoCitaTitle.style.fontSize = "30px"
        motivoCitaTitle.style.fontWeight = "bold"
        motivoCitaTitle.style.marginTop = "35px"
        motivoCitaTitle.style.color = "#0070c0"
        motivoCitaTitle.style.textAlign = "left"
        container?.appendChild(motivoCitaTitle)

        const motivoCitaContent = document.createElement("p")
        motivoCitaContent.textContent = `${motivo}`
        motivoCitaContent.style.fontSize = "28px"
        motivoCitaContent.style.fontWeight = "normal"
        motivoCitaContent.style.marginTop = "10px"
        motivoCitaContent.style.color = "#000000"
        motivoCitaContent.style.textAlign = "left"
        container?.appendChild(motivoCitaContent)

        const text1 = document.createElement("p")
        text1.textContent = "En el siguiente listado de enfermedades por favor marque SI o NO ha padecido alguna"
        text1.style.fontSize = "28px"
        text1.style.fontWeight = "normal"
        text1.style.marginTop = "45px"
        text1.style.color = "#000000"
        text1.style.textAlign = "left"
        container?.appendChild(text1)

        const text2 = document.createElement("p")
        text2.textContent = "Si su respuesta es SI, por favor describa el tratamiento recibido"
        text2.style.fontSize = "28px"
        text2.style.fontWeight = "normal"
        text2.style.marginTop = "5px"
        text2.style.color = "#000000"
        text2.style.textAlign = "left"
        container?.appendChild(text2)

        document.body.appendChild(container)

        // Crear un contenedor para el contenido del PDF
        const container2 = document.createElement("div")
        container2.style.display = "flex"
        container2.style.flexDirection = "column" // Asegura que todo esté apilado verticalmente
        container2.style.width = "100%"
        // container2.style.marginTop = "20rem" // Espaciado para separar del contenido original
        container2.style.paddingBottom = "20px"

        const odontoTitle = document.createElement("h2")
        odontoTitle.textContent = "ODONTOGRAMA"
        odontoTitle.style.fontSize = "30px"
        odontoTitle.style.fontWeight = "bold"
        odontoTitle.style.marginTop = "20px"
        odontoTitle.style.color = "#0070c0"
        odontoTitle.style.textAlign = "left"
        container2?.appendChild(odontoTitle)

        const odontoSubtitle = document.createElement("p")
        odontoSubtitle.textContent = "Examen clinico intraoral"
        odontoSubtitle.style.fontSize = "28px"
        odontoSubtitle.style.fontWeight = "normal"
        odontoSubtitle.style.marginTop = "5px"
        odontoSubtitle.style.color = "#000000"
        odontoSubtitle.style.textAlign = "left"
        container2?.appendChild(odontoSubtitle)

        document.body.appendChild(container2)

        const container3 = document.createElement("div")
        container3.style.display = "flex"
        container3.style.flexDirection = "column" // Asegura que todo esté apilado verticalmente
        container3.style.width = "100%"
        container3.style.marginTop = "20px" // Espaciado para separar del contenido original
        container3.style.paddingBottom = "20px"

        const extraTitle = document.createElement("h2")
        extraTitle.textContent = "EXAMEN EXTRAORAL"
        extraTitle.style.fontSize = "30px"
        extraTitle.style.fontWeight = "bold"
        // extraTitle.style.marginTop = "20px"
        extraTitle.style.color = "#0070c0"
        extraTitle.style.textAlign = "left"
        container3?.appendChild(extraTitle)

        const fila4 = document.createElement("div")
        fila4.style.display = "flex"
        fila4.style.flexDirection = "row"
        fila4.style.justifyContent = "space-between";
        fila4.style.marginTop = "10px"
        fila4.style.gap = "50px"

        const cabeza = document.createElement("p")
        cabeza.textContent = `Cabeza: ${medicalHistory.extraOralExam.head}`
        cabeza.style.fontSize = "28px"
        cabeza.style.fontWeight = "normal"
        cabeza.style.marginTop = "25px"
        cabeza.style.color = "#000000"
        cabeza.style.textAlign = "left"
        fila4?.appendChild(cabeza)

        const cara = document.createElement("p")
        cara.textContent = `Cara: ${medicalHistory.extraOralExam.face}`
        cara.style.fontSize = "28px"
        cara.style.fontWeight = "normal"
        cara.style.marginTop = "25px"
        cara.style.color = "#000000"
        cara.style.textAlign = "left"
        fila4?.appendChild(cara)

        container3?.appendChild(fila4)

        const fila5 = document.createElement("div")
        fila5.style.display = "flex"
        fila5.style.flexDirection = "row"
        fila5.style.justifyContent = "space-between";
        fila5.style.marginTop = "10px"
        fila5.style.gap = "50px"

        const atm = document.createElement("p")
        atm.textContent = `ATM: ${medicalHistory.extraOralExam.atm}`
        atm.style.fontSize = "28px"
        atm.style.fontWeight = "normal"
        atm.style.marginTop = "25px"
        atm.style.color = "#000000"
        atm.style.textAlign = "left"
        fila5?.appendChild(atm)

        const ganglios = document.createElement("p")
        ganglios.textContent = `Ganglios: ${medicalHistory.extraOralExam.ganglios}`
        ganglios.style.fontSize = "28px"
        ganglios.style.fontWeight = "normal"
        ganglios.style.marginTop = "25px"
        ganglios.style.color = "#000000"
        ganglios.style.textAlign = "left"
        fila5?.appendChild(ganglios)

        container3?.appendChild(fila5)

        const lips = document.createElement("p")
        lips.textContent = `Labios ${medicalHistory.extraOralExam.lips}`
        lips.style.fontSize = "28px"
        lips.style.fontWeight = "normal"
        lips.style.marginTop = "25px"
        lips.style.color = "#000000"
        lips.style.textAlign = "left"
        container3?.appendChild(lips)

        const diagnosticTitle = document.createElement("h2")
        diagnosticTitle.textContent = "DIAGNOSTICO"
        diagnosticTitle.style.fontSize = "30px"
        diagnosticTitle.style.fontWeight = "bold"
        diagnosticTitle.style.marginTop = "20px"
        diagnosticTitle.style.color = "#0070c0"
        diagnosticTitle.style.textAlign = "left"
        container3?.appendChild(diagnosticTitle)

        const diagnostico = document.createElement("p")
        diagnostico.textContent = `${formik.values.diagnostico}`
        diagnostico.style.fontSize = "28px"
        diagnostico.style.fontWeight = "normal"
        diagnostico.style.marginTop = "15px"
        diagnostico.style.color = "#000000"
        diagnostico.style.textAlign = "left"
        container3?.appendChild(diagnostico)

        document.body.appendChild(container3)

        const container4 = document.createElement("div")
        container4.style.display = "flex"
        container4.style.flexDirection = "column" // Asegura que todo esté apilado verticalmente
        container4.style.width = "100%"
        container4.style.marginTop = "50px" // Espaciado para separar del contenido original
        container4.style.paddingBottom = "20px"

        const acceptHistorial = document.createElement("p")
        acceptHistorial.textContent = `
        Yo ${formik.values.nombreCompleto} hago constar que la informacion proporcionada es verifica y
        autorizo que se me realicen los procedimientos correspondientes para mi tratamiento o plan de trabajo, aunque
        conozco los riesgos que los procedimientos con llevan.
        `
        acceptHistorial.style.fontSize = "29px"
        acceptHistorial.style.fontWeight = "bold"
        acceptHistorial.style.marginTop = "50px"
        acceptHistorial.style.color = "#000000"
        acceptHistorial.style.textAlign = "left"
        container4?.appendChild(acceptHistorial)

        document.body.appendChild(container4)

        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const contentWidth = pageWidth - (2 * margin);
        let yPosition = margin;

        // Función auxiliar para añadir una imagen al PDF
        const addImageToPdf = async (element: any, posicionHorizontal?: number, scale?: number, nuevaPagina?: boolean, width?: number, height?: number) => {
            const canvas = await html2canvas(element, { scale: scale, width: width || undefined, height: height || undefined });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = contentWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (nuevaPagina || (yPosition + imgHeight > pageHeight - margin)) {
                pdf.addPage();
                yPosition = margin;
            }

            const xPosition = posicionHorizontal || margin;

            pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + margin;

            return imgHeight;
        };

        await addImageToPdf(container);

        const diseasesElement = document.getElementById('diseases');
        if (diseasesElement) {
            await addImageToPdf(diseasesElement);
        }

        await addImageToPdf(container2, 10, 1, true);

        const odontogramElement = document.getElementById('odontogram');
        if (odontogramElement) {
            await addImageToPdf(odontogramElement, -10, 1, false, 980, 350);
        }

        await addImageToPdf(container3, 10, 1);

        await addImageToPdf(container4, 10, 1);

        // pdf.save("HistoriaClinicaPaciente.pdf")

        // Elimina la copia del DOM
        //@ts-ignore
        container?.remove()
        //@ts-ignore
        container2?.remove()
        //@ts-ignore
        container3?.remove()
        //@ts-ignore
        container4?.remove()

        const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
        return pdfBlob;
    }
}

