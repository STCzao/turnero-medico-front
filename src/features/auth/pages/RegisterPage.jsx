import { motion } from 'framer-motion'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6 py-4 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="max-w-lg mx-auto"
      >
        <div className="text-center mb-4">
          <p className="text-mint/60 text-xs uppercase tracking-[0.2em] font-semibold mb-2">Registro de paciente</p>
          <h1 className="text-white font-black text-3xl tracking-tight mb-1">Creá tu cuenta.</h1>
          <p className="text-white/40 text-sm">Completá tus datos para acceder a Clínica Meridian</p>
        </div>

        <div className="bg-deep rounded-2xl p-6">
          <RegisterForm />
        </div>

        <p className="text-white/20 text-xs text-center mt-4">
          © {new Date().getFullYear()} Clínica Meridian
        </p>
      </motion.div>
    </div>
  )
}
