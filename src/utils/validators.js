// Reglas de validación reutilizables.
// Cada regla es una factory que retorna un validador: (value: string) => string | null
// validate(schema, form) aplica el schema al form y devuelve { [field]: mensajeError }

const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DNI_RE      = /^\d{7,8}$/
const TELEFONO_RE = /^[\d\s\-+()]{8,20}$/

export const rules = {
  required: (msg = 'Campo obligatorio') =>
    (v) => !v?.toString().trim() ? msg : null,

  email: (msg = 'Email inválido') =>
    (v) => !EMAIL_RE.test(v) ? msg : null,

  minLength: (min, msg) =>
    (v) => (v?.length ?? 0) < min ? (msg ?? `Mínimo ${min} caracteres`) : null,

  maxLength: (max, msg) =>
    (v) => (v?.length ?? 0) > max ? (msg ?? `Máximo ${max} caracteres`) : null,

  pattern: (re, msg = 'Formato inválido') =>
    (v) => !re.test(v) ? msg : null,

  dni: (msg = 'DNI debe tener 7 u 8 dígitos') =>
    (v) => !DNI_RE.test(v) ? msg : null,

  telefono: (msg = 'Teléfono inválido') =>
    (v) => !TELEFONO_RE.test(v) ? msg : null,

  minAge: (years, msg) =>
    (v) => {
      if (!v) return null
      const birth = new Date(v)
      const limit = new Date()
      limit.setFullYear(limit.getFullYear() - years)
      return birth <= limit ? null : (msg ?? `Debés tener al menos ${years} años`)
    },
}

export const NOMBRE_RULES = [
  rules.required(),
  rules.minLength(2),
  rules.maxLength(50),
  rules.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios'),
]

export const PASSWORD_RULES = [
  rules.required('La contraseña es obligatoria'),
  rules.minLength(8, 'La contraseña debe tener al menos 8 caracteres'),
  rules.maxLength(100, 'La contraseña no puede exceder 100 caracteres'),
  rules.pattern(/[A-Z]/, 'Debe incluir al menos una letra mayúscula'),
  rules.pattern(/[a-z]/, 'Debe incluir al menos una letra minúscula'),
  rules.pattern(/\d/, 'Debe incluir al menos un número'),
]

export const EMAIL_RULES = [
  rules.required(),
  rules.email(),
  rules.maxLength(100, 'El email no puede exceder 100 caracteres'),
]

/**
 * @param {Record<string, Function[]>} schema  - { campo: [regla1, regla2, ...] }
 * @param {Record<string, string>}     form    - valores del formulario
 * @returns {Record<string, string>}           - errores por campo (solo los que fallan)
 */
export function validate(schema, form) {
  const errors = {}
  for (const [field, fieldRules] of Object.entries(schema)) {
    for (const rule of fieldRules) {
      const msg = rule(form[field] ?? '')
      if (msg) { errors[field] = msg; break }
    }
  }
  return errors
}
