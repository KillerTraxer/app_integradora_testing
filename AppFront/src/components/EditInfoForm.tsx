import { useState } from "react"
import { Button, Input } from "@nextui-org/react";
import { Edit2 } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import api from "@/axiosInstance"

const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre no puede estar vació'),
    email: Yup.string().email('Correo electrónico inválido').required('El correo electrónico no puede estar vació'),
    phone: Yup.string().matches(/^\d{10}$/, 'El teléfono debe tener 10 dígitos').required('El teléfono no puede estar vació'),
})

export default function EditInfoForm() {
    const [editingField, setEditingField] = useState<string | null>(null)
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [errorMessages, setErrorMessages] = useState('');
    const { auth } = useAuthStore()
    const [userData, setUserData] = useState({
        name: auth?.user?.nombre || "",
        email: auth?.user?.email || "",
        phone: auth?.user?.telefono || "",
    })

    const formik = useFormik({
        initialValues: userData,
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            // setIsLoading(true);
            // setErrorMessages('');
            // setEmail(values.email)

            try {
                // const response = await api.post('/auth/login', {
                //     name: values.name,
                //     email: values.email,
                //     phone: values.phone,
                // });

                // const authData = response.data;
                await new Promise(resolve => setTimeout(resolve, 1000))

                setUserData(values)
                setEditingField(null)

                console.log('Datos actualizados:', values)
            } catch (error: any) {
                if (error.response && error.response.status === 400) {
                    setErrorMessages(error.response.data.message);
                } else {
                    setErrorMessages("Error inesperado en el servidor. Por favor, intenta de nuevo más tarde.");
                }
            } finally {
                // setIsLoading(false);
                setSubmitting(false)
            }

        },
    });

    const handleEdit = (field: string) => {
        setEditingField(field)
        formik.setValues(userData)
    }

    const getInputColor = (fieldName: string) => {
        if (focusedField === fieldName) {
            return formik.touched[fieldName as keyof typeof formik.touched] && formik.errors[fieldName as keyof typeof formik.errors] ? "danger" : "primary";
        }
        return "default";
    }

    return (
        <>
            {errorMessages && (
                <p className="bg-red-100 text-red-500 p-3 rounded-md mb-4">
                    {errorMessages}
                </p>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4 mb-5">
                {['name', 'email', 'phone'].map((field) => (
                    <div key={field} className="space-y-2">
                        {editingField !== field ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{field === 'name' ? 'Nombre' : field === 'email' ? 'Correo electrónico' : 'Teléfono'}</p>
                                    <p className="font-extralight">{userData[field as keyof typeof userData]}</p>
                                </div>
                                <Button
                                    variant="light"
                                    onClick={() => handleEdit(field)}
                                >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2 flex flex-row justify-between gap-8">
                                <Input
                                    name={field}
                                    label={field === 'name' ? 'Nombre' : field === 'email' ? 'Correo electrónico' : 'Teléfono'}
                                    value={formik.values[field as keyof typeof formik.values]}
                                    onChange={formik.handleChange}
                                    onBlur={(e) => {
                                        setFocusedField(null);
                                        formik.handleBlur(e)
                                    }}
                                    className="lg:w-1/2 w-full"
                                    isInvalid={formik.touched[field as keyof typeof formik.touched] && !!formik.errors[field as keyof typeof formik.errors]}
                                    errorMessage={formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors]}
                                    color={getInputColor(field)}
                                    onFocus={() => setFocusedField(field)}
                                />
                                <div>
                                    <Button color="primary" type="submit" disabled={formik.isSubmitting}>
                                        {formik.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </form>
        </>
    )
}
