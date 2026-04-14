import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import useAuthStore from '../../../store/authSlice'
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
  const [showPwd, setShowPwd] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPwd ? 'text' : 'password') : type

  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
          className={`w-full bg-navy border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none transition-all duration-150
            ${isPassword ? 'pr-10' : ''}
            ${error
              ? 'border-red-400/60 focus:border-red-400'
              : 'border-white/10 focus:border-mint'
            }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
            tabIndex={-1}
          >
            {showPwd ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
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
      await login(form)
      // Leemos getState() post-await: el store ya fue actualizado por login()
      const rol = useAuthStore.getState().user?.rol
      navigate(getHomeByRol(rol), { replace: true })
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
