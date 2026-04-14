import { motion } from "framer-motion";
import LoginForm from "../components/LoginForm";
import logo from "../../../assets/logo.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-navy flex">
      {/* Panel izquierdo — solo visible en md+ */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:flex flex-col justify-center relative w-[42%] bg-deep p-14"
      >
        <div>
          <p className="text-mint/50 text-xs uppercase tracking-[0.2em] font-semibold mb-5">
            Gestión de turnos
          </p>
          <h1 className="text-white font-black text-5xl leading-[1.1] tracking-tight">
            Tu salud,
            <br />
            sin esperas. <span className="text-mint">Organizada.</span>
          </h1>
          <p className="text-white/40 text-base mt-6 leading-relaxed max-w-xs">
            Solicitá, confirmá y seguí tus turnos médicos desde un solo lugar.
          </p>
        </div>

        <p className="absolute bottom-10 left-14 text-white/20 text-xs">
          © {new Date().getFullYear()} Clínica Meridian
        </p>
      </motion.aside>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-6 md:py-12 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Logo centrado sobre el formulario */}
          <div className="flex justify-center">
            <img src={logo} alt="Clínica Meridian" className="h-24 md:h-44 w-auto" />
          </div>

          <h2 className="text-white font-black text-center text-4xl tracking-tight mb-1">
            Bienvenido.
          </h2>
          <p className="text-white/40 text-center text-sm mb-6">
            Ingresá tu cuenta para continuar
          </p>
          <div className="bg-deep rounded-2xl p-8">
            <LoginForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
