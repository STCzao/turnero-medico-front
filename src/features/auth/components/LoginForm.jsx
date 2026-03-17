import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { getHomeByRol } from '../../../router/redirect'
import { ROUTES } from '../../../router/routes'
import { validate, rules } from '../../../utils/validators'

const LOGIN_SCHEMA = {
  email:    [rules.required('El email es obligatorio'), rules.email('Formato de email inválido')],
  password: [rules.required('La contraseña es obligatoria')],
}

const fieldAnim = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' },
  }),
}

function FInput({ id, label, type = 'text', placeholder, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className={`w-full bg-navy border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none transition-all duration-150
          ${error
            ? 'border-red-400/60 focus:border-red-400'
            : 'border-white/10 focus:border-mint'
          }`}
      />
      {error && <p className="text-red-400 text-xs mt-1.5 font-medium">{error}</p>}
    </div>
  )
}

export default function LoginForm() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.id]: e.target.value }))
    setFieldErrors((p) => ({ ...p, [e.target.id]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validate(LOGIN_SCHEMA, form)
    if (Object.keys(errors).length) { setFieldErrors(errors); return }
    try {
      const data = await login(form)
      navigate(getHomeByRol(data?.rol), { replace: true })
    } catch { /* manejo en hook */ }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {[
        { i: 0, id: 'email',    label: 'Correo electrónico', type: 'email',    placeholder: 'usuario@email.com' },
        { i: 1, id: 'password', label: 'Contraseña',         type: 'password', placeholder: '••••••••••••' },
      ].map(({ i, ...f }) => (
        <motion.div key={f.id} custom={i} variants={fieldAnim} initial="hidden" animate="visible">
          <FInput {...f} value={form[f.id]} onChange={handleChange} error={fieldErrors[f.id]} />
        </motion.div>
      ))}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs text-center bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5"
        >
          {error}
        </motion.p>
      )}

      <motion.div custom={2} variants={fieldAnim} initial="hidden" animate="visible">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-mint text-navy font-black text-sm py-3 rounded-xl tracking-wide transition-all duration-150 hover:bg-white active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Verificando...
            </span>
          ) : 'Iniciar sesión'}
        </button>
      </motion.div>

      <motion.p custom={3} variants={fieldAnim} initial="hidden" animate="visible" className="text-center text-white/30 text-xs pt-1">
        ¿No tenés cuenta?{' '}
        <Link to={ROUTES.REGISTER} className="text-mint hover:text-white transition-colors font-bold">
          Registrate
        </Link>
      </motion.p>
    </form>
  )
}
