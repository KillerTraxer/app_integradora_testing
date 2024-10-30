import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Users, MapPinned } from 'lucide-react'
import Doctor from '../assets/doctor_landing.png';
import Logo from '../assets/logo_landing.svg';
import DentistHomeIcon1 from "../assets/dentist4-home-icon1.png";
import DentistHomeIcon2 from "../assets/dentist4-home-icon2.png";
import DentistHomeIcon3 from "../assets/dentist4-home-icon3.png";
import { motion } from 'framer-motion';

const services = [
    {
        name: 'Agenda en línea',
        description: 'Reserva tu cita de forma rápida y sencilla a través de nuestro sistema en línea',
        icon: DentistHomeIcon1
    },
    {
        name: 'Estética dental',
        description: 'Mejora tu sonrisa con nuestros tratamientos de estética dental de última generación',
        icon: DentistHomeIcon2
    },
    {
        name: 'Colocación de implantes',
        description: 'Restaura tu sonrisa con implantes dentales de alta calidad y tecnología avanzada',
        icon: DentistHomeIcon3
    },
]

const team = [
    { name: 'Dra. Ana Martínez', role: 'Odontóloga General' },
    { name: 'Dr. Carlos Ruiz', role: 'Ortodoncista' },
    { name: 'Dra. Laura Gómez', role: 'Implantóloga' },
]

const locations = [
    { name: 'Clínica Central', address: 'Av. Principal 123, Ciudad' },
    //{ name: 'Sucursal Norte', address: 'Calle 45 #67-89, Zona Norte' },
]

export default function LandingPage() {
    const [isSticky, setIsSticky] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [animatedSections, setAnimatedSections] = useState<string[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const section = entry.target.id;
                        if (!animatedSections.includes(section)) {
                            setAnimatedSections((prev) => [...prev, section]);
                        }
                    }
                });
            },
            { threshold: 0.1 }
        );

        const sections = ['hero', 'services', 'team', 'location', 'cta'];
        sections.forEach((section) => {
            const element = document.getElementById(section);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            sections.forEach((section) => {
                const element = document.getElementById(section);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [animatedSections]);

    useEffect(() => {
        setAnimatedSections(['hero'])
    }, []);

    const navItems = [
        { name: 'Inicio', href: '#hero' },
        { name: 'Servicios', href: '#services' },
        { name: 'Equipo', href: '#team' },
        { name: 'Ubicación', href: '#location' },
    ];

    const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        event.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <header className={`fixed w-full z-50 transition-all ${isSticky ? 'bg-white shadow-md' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="flex items-center justify-between h-20"
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="flex items-center">
                            <img src={Logo} alt="Cio Dental Logo" width={40} height={40} className="mr-2" />
                            <span className={` ${isSticky ? "text-blue-600 md:text-blue-600" : "text-white md:text-blue-600"} text-2xl font-bold`}>Dental Care</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-4">
                            {navItems.map((item) => (
                                <a key={item.name} href={item.href} className={`${isSticky ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-gray-300'}`} onClick={(e) => handleNavClick(e, item.href)}>{item.name}</a>
                            ))}
                            <button onClick={() => navigate('/login')} className={`${isSticky ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white hover:bg-gray-300 text-gray-900'} px-4 py-2 rounded-full transition duration-300`}>
                                Iniciar Sesión
                            </button>
                        </nav>
                        <button onClick={() => setIsMenuOpen(true)} className={`${isSticky ? 'text-gray-900' : 'text-white'} md:hidden`}>
                            <Menu size={24} />
                        </button>
                    </motion.div>
                </div>
            </header>

            {isMenuOpen && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
                    <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-4 text-gray-700">
                        <X size={24} />
                    </button>
                    <nav className="flex flex-col items-center space-y-4">
                        {navItems.map((item) => (
                            <a key={item.name} href={item.href} className="text-gray-700 text-2xl" onClick={() => setIsMenuOpen(false)}>{item.name}</a>
                        ))}
                        <button onClick={() => navigate('/login')} className="bg-blue-500 text-white px-6 py-2 rounded-full text-xl transition duration-300">
                            Iniciar Sesión
                        </button>
                    </nav>
                </div>
            )}

            <main>
                <section id="hero" className={`relative min-h-screen flex items-center transition-opacity duration-1000 ${animatedSections.includes('hero') ? 'opacity-100' : 'opacity-0'}`}>
                    <motion.div
                        className="absolute inset-0 z-0"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                            <div className="bg-gray-100 relative hidden md:block"></div>
                            <div className="bg-blue-600 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
                                <img src={Doctor} alt="Doctor" className={`md:absolute md:bottom-0 md:left-0 md:w-[430px] md:h-[570px] md:transform md:translate-x-32 md:-translate-y-1/8 md:flex hidden transition-all duration-1000`} />
                            </div>
                        </div>
                    </motion.div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <motion.div
                                className="text-center md:text-left"
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold md:text-blue-600 text-blue-950 mb-2">BIENVENIDO A NUESTRA CLÍNICA</h2>
                                <h1 className="text-5xl md:text-6xl font-extrabold md:text-gray-900 text-white mb-4">
                                    Haz brillar<br />tu sonrisa
                                </h1>
                                <p className="text-lg md:text-gray-600 text-gray-200 mb-8">
                                    En Cio Dental, nos dedicamos a crear sonrisas hermosas y saludables. Nuestro equipo de expertos utiliza
                                    la última tecnología para brindarle la mejor atención dental.
                                </p>
                                <button
                                    className="md:bg-blue-500 bg-white md:hover:bg-blue-600 hover:bg-gray-300 md:text-white text-gray-900 px-8 py-3 rounded-full text-lg font-semibold transition duration-300"
                                    onClick={() => navigate('/schedule')}
                                >
                                    AGENDAR CITA
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section id="services" className="py-24 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className={`text-blue-600 text-lg font-semibold mb-4 transition-all duration-1000 transform ${animatedSections.includes('services') ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                                }`}>
                                SERVICIOS
                            </h3>
                            <h2 className={`text-4xl md:text-5xl font-bold text-blue-900 mb-4 transition-all duration-1000 transform ${animatedSections.includes('services') ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                                }`} style={{ transitionDelay: '200ms' }}>
                                Servicios generales en<br />Cio Dental
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    className={`text-center transition-all duration-1000 transform ${animatedSections.includes('services')
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-16 opacity-0'
                                        }`}
                                    style={{ transitionDelay: `${(index + 2) * 200}ms` }}
                                >
                                    <div className="flex justify-center mb-4">
                                        <img src={service.icon} width={75} height={75} className="text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-900 mb-2">{service.name}</h3>
                                    <p className="text-gray-600 font-semibold">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="team" className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className={`text-blue-600 text-lg font-semibold mb-4 transition-all duration-1000 transform ${animatedSections.includes('team') ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                                }`}>
                                NUESTRO EQUIPO
                            </h3>
                            <h2 className={`text-4xl md:text-5xl font-bold text-blue-900 mb-4 transition-all duration-1000 transform ${animatedSections.includes('team') ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                                }`} style={{ transitionDelay: '200ms' }}>
                                Profesionales expertos<br />a tu servicio
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {team.map((member, index) => (
                                <div
                                    key={index}
                                    className={`bg-white rounded-lg p-6 shadow-md text-center transition-all duration-1000 transform ${animatedSections.includes('team')
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-16 opacity-0'
                                        }`}
                                    style={{ transitionDelay: `${(index + 2) * 200}ms` }}
                                >
                                    <div className="w-32 h-32 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <Users size={48} className="text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-900 mb-2">{member.name}</h3>
                                    <p className="text-gray-600">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="location" className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className={`text-blue-600 text-lg font-semibold mb-4 transition-all duration-1000 transform ${animatedSections.includes('location') ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                                }`}>
                                UBICACIONES
                            </h3>
                            <h2 className={`text-4xl md:text-5xl font-bold text-blue-900 mb-4 transition-all duration-1000 transform ${animatedSections.includes('location') ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                                }`} style={{ transitionDelay: '200ms' }}>
                                Encuentra tu clínica<br />más cercana
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                            {locations.map((location, index) => (
                                <div
                                    key={index}
                                    className={`bg-gray-50 rounded-lg p-6 shadow-md flex items-start transition-all duration-1000 transform ${animatedSections.includes('location')
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-16 opacity-0'
                                        }`}
                                    style={{ transitionDelay: `${(index + 2) * 200}ms` }}
                                >
                                    <MapPinned size={48} className="text-blue-600 mr-4 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{location.name}</h3>
                                        <p className="text-gray-600">{location.address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="cta" className={`py-16 bg-blue-600 transition-opacity duration-1000 ${animatedSections.includes('cta') ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className={`text-3xl font-bold text-white mb-8 transition-all duration-1000 transform ${animatedSections.includes('cta') ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                            }`}>
                            ¿Listo para mejorar tu sonrisa?
                        </h2>
                        <button className={`bg-white text-blue-600 hover:bg-blue-100 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-1000 transform ${animatedSections.includes('cta') ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                            }`} style={{ transitionDelay: '200ms' }} onClick={() => navigate('/schedule')}>
                            Agendar cita
                        </button>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Cio Dental</h3>
                            <p>Cuidando sonrisas desde 1995</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Contacto</h3>
                            <p className="flex items-center mb-2"><Phone size={16} className="mr-2" /> +1 234 567 890</p>
                            <p className="flex items-center mb-2"><Mail size={16} className="mr-2" /> info@ciodental.com</p>
                            <p className="flex items-center"><MapPin size={16} className="mr-2" /> Av. Principal 123, Ciudad</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Síguenos</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="hover:text-blue-400 transition duration-300"><Facebook /></a>
                                <a href="#" className="hover:text-blue-400 transition duration-300"><Instagram /></a>
                                <a href="#" className="hover:text-blue-400 transition duration-300"><Twitter /></a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center">
                        <p>&copy; 2024 Cio Dental. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}