import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "../../../components/layout/PageWrapper";
import { useMedicosByEspecialidad } from "../../medicos/hooks/useMedicos";
import { useTurnoActions } from "../hooks/useTurnos";
import { ROUTES } from "../../../router/routes";
import { useEspecialidades } from "../../especialidades/hooks/useEspecialidades";
import { validate, rules } from "../../../utils/validators";
import {
  useMyProfile,
  useDependientes,
} from "../../pacientes/hooks/usePacientes";
import { useObrasSociales } from "../../obrasSociales/hooks/useObrasSociales";

const PASOS = ["Especialidad", "Detalles", "Confirmar"];

function StepIndicator({ paso }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {PASOS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
              i < paso
                ? "bg-teal text-white"
                : i === paso
                  ? "bg-deep text-mint"
                  : "bg-deep/10 text-deep/30"
            }`}
          >
            {i < paso ? (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          <span
            className={`text-xs font-semibold hidden sm:block ${i === paso ? "text-deep" : "text-deep/30"}`}
          >
            {label}
          </span>
          {i < PASOS.length - 1 && (
            <div
              className={`h-px w-8 mx-1 ${i < paso ? "bg-teal" : "bg-deep/10"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function SolicitarTurnoPage() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(0);
  const [form, setForm] = useState({
    paraMi: true,
    dependienteId: "",
    dependienteNombre: "",
    especialidadId: "",
    especialidadNombre: "",
    motivo: "",
    doctorId: "",
    obraSocialId: "",
    numeroAfiliadoDeclarado: "",
    planAfiliadoDeclarado: "",
  });
  const [errors, setErrors] = useState({});

  const { perfil } = useMyProfile();
  const { dependientes } = useDependientes();
  const { items: obrasSociales } = useObrasSociales({ pageSize: 100 });

  const { especialidades, loading: loadingEsp } = useEspecialidades();
  const { medicos, loading: loadingMedicos } = useMedicosByEspecialidad(
    form.especialidadId,
  );
  const {
    crear,
    loading,
    error: submitError,
  } = useTurnoActions(() => {
    navigate(ROUTES.MIS_TURNOS, { state: { turnoSolicitado: true } });
  });

  const avanzar = () => {
    if (paso === 0) {
      const errs = validate(
        { especialidadId: [rules.required("Seleccioná una especialidad")] },
        form,
      );
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
    }
    if (paso === 1) {
      const errs = validate(
        {
          motivo: [
            rules.required("Describí el motivo de tu consulta"),
            rules.minLength(5),
          ],
        },
        form,
      );
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
    }
    setErrors({});
    setPaso((p) => p + 1);
  };

  const handleSubmit = async () => {
    const payload = {
      pacienteId: form.paraMi ? perfil?.id : Number(form.dependienteId),
      especialidadId: Number(form.especialidadId),
      motivo: form.motivo.trim(),
      ...(form.doctorId && { doctorId: Number(form.doctorId) }),
      ...(form.obraSocialId && { obraSocialId: Number(form.obraSocialId) }),
      ...(form.numeroAfiliadoDeclarado && {
        numeroAfiliadoDeclarado: form.numeroAfiliadoDeclarado.trim(),
      }),
      ...(form.planAfiliadoDeclarado && {
        planAfiliadoDeclarado: form.planAfiliadoDeclarado.trim(),
      }),
    };
    try {
      await crear(payload);
    } catch {
      // el error ya se muestra vía submitError
    }
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() =>
            paso > 0 ? setPaso((p) => p - 1) : navigate(ROUTES.HOME)
          }
          className="flex items-center gap-1.5 text-deep/40 hover:text-deep text-sm font-medium transition-colors mb-4"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {paso > 0 ? "Atrás" : "Volver"}
        </button>
        <h1 className="text-deep font-black text-2xl md:text-3xl tracking-tight">
          Solicitar turno
        </h1>
        <p className="text-deep/50 text-sm mt-1">
          Tu solicitud será revisada y confirmada por el equipo médico
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <StepIndicator paso={paso} />

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-deep/5">
          <AnimatePresence mode="wait">
            {/* ── Paso 0 — Especialidad ── */}
            {paso === 0 && (
              <motion.div
                key="paso0"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <h2 className="text-deep font-bold text-lg mb-1">
                  ¿Qué especialidad necesitás?
                </h2>
                <p className="text-deep/40 text-sm mb-5">
                  Seleccioná la especialidad médica más adecuada a tu consulta
                </p>

                {/* Selector de beneficiario */}
                {dependientes.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[11px] font-bold text-deep/40 uppercase tracking-widest mb-2">
                      ¿Para quién es el turno?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            paraMi: true,
                            dependienteId: "",
                            dependienteNombre: "",
                          }))
                        }
                        className={`text-sm font-semibold px-4 py-2 rounded-full border transition-all ${
                          form.paraMi
                            ? "bg-deep text-mint border-deep"
                            : "bg-deep/5 text-deep/55 border-transparent hover:bg-deep/10 hover:text-deep"
                        }`}
                      >
                        Para mí
                      </button>
                      {dependientes.map((dep) => (
                        <button
                          key={dep.id}
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              paraMi: false,
                              dependienteId: dep.id,
                              dependienteNombre: `${dep.nombre} ${dep.apellido}`,
                            }))
                          }
                          className={`text-sm font-semibold px-4 py-2 rounded-full border transition-all ${
                            !form.paraMi && form.dependienteId === dep.id
                              ? "bg-deep text-mint border-deep"
                              : "bg-deep/5 text-deep/55 border-transparent hover:bg-deep/10 hover:text-deep"
                          }`}
                        >
                          {dep.nombre} {dep.apellido}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {loadingEsp ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-deep/5 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {especialidades.map((esp) => (
                      <button
                        key={esp.id}
                        type="button"
                        onClick={() => {
                          setForm((f) => ({
                            ...f,
                            especialidadId: esp.id,
                            especialidadNombre: esp.nombre,
                            doctorId: "",
                          }));
                          setErrors({});
                        }}
                        className={`text-left text-sm px-4 py-3 rounded-xl border font-medium transition-all ${
                          form.especialidadId === esp.id
                            ? "bg-deep text-mint border-deep"
                            : "bg-deep/5 text-deep/70 border-transparent hover:bg-deep/10 hover:text-deep"
                        }`}
                      >
                        {esp.nombre}
                      </button>
                    ))}
                  </div>
                )}

                {errors.especialidadId && (
                  <p className="text-red-500 text-xs mt-3">
                    {errors.especialidadId}
                  </p>
                )}
              </motion.div>
            )}

            {/* ── Paso 1 — Detalles ── */}
            {paso === 1 && (
              <motion.div
                key="paso1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <h2 className="text-deep font-bold text-lg mb-1">
                  Contanos tu consulta
                </h2>
                <p className="text-deep/40 text-sm mb-5">
                  Esta información ayuda al equipo médico a prepararse para tu
                  atención
                </p>

                {/* Motivo */}
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-deep/40 uppercase tracking-widest mb-2">
                    Motivo de consulta <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.motivo}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, motivo: e.target.value }));
                      setErrors({});
                    }}
                    placeholder="Describí brevemente tus síntomas o el motivo de la consulta..."
                    rows={3}
                    className={`w-full bg-deep/5 border rounded-xl px-4 py-3 text-deep text-sm placeholder-deep/25 focus:outline-none transition-all resize-none
                      ${errors.motivo ? "border-red-400/60 focus:border-red-400" : "border-transparent focus:border-teal"}`}
                  />
                  {errors.motivo && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.motivo}
                    </p>
                  )}
                </div>

                {/* Doctor (opcional) */}
                <div className="mb-6">
                  <label className="block text-[11px] font-bold text-deep/40 uppercase tracking-widest mb-2">
                    Preferencia de médico{" "}
                    <span className="text-deep/25 normal-case font-normal tracking-normal">
                      (opcional)
                    </span>
                  </label>
                  {loadingMedicos ? (
                    <div className="h-11 bg-deep/5 rounded-xl animate-pulse" />
                  ) : medicos.length === 0 ? (
                    <p className="text-deep/30 text-sm italic">
                      No hay médicos registrados para {form.especialidadNombre}
                    </p>
                  ) : (
                    <select
                      value={form.doctorId}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, doctorId: e.target.value }))
                      }
                      className="w-full bg-deep/5 border border-transparent focus:border-teal rounded-xl px-4 py-3 text-deep text-sm focus:outline-none transition-all appearance-none"
                    >
                      <option value="">Sin preferencia</option>
                      {medicos.map((m) => (
                        <option key={m.id} value={m.id}>
                          Dr. {m.nombre} {m.apellido}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Cobertura médica */}
                <div className="border-t border-deep/5 pt-5 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-deep/40 uppercase tracking-widest mb-2">
                      Obra social
                    </label>
                    <select
                      value={form.obraSocialId}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, obraSocialId: e.target.value }))
                      }
                      className="w-full bg-deep/5 border border-transparent focus:border-teal rounded-xl px-4 py-3 text-deep text-sm focus:outline-none transition-all appearance-none"
                    >
                      <option value="">Particular / Sin obra social</option>
                      {obrasSociales.map((os) => (
                        <option key={os.id} value={os.id}>
                          {os.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {form.obraSocialId && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-deep/40 uppercase tracking-widest mb-2">
                          N° de afiliado
                        </label>
                        <input
                          value={form.numeroAfiliadoDeclarado}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              numeroAfiliadoDeclarado: e.target.value,
                            }))
                          }
                          placeholder="00000000"
                          maxLength={30}
                          className="w-full bg-deep/5 border border-transparent focus:border-teal rounded-xl px-4 py-3 text-deep text-sm placeholder-deep/25 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-deep/40 uppercase tracking-widest mb-2">
                          Plan
                        </label>
                        <input
                          value={form.planAfiliadoDeclarado}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              planAfiliadoDeclarado: e.target.value,
                            }))
                          }
                          placeholder="Plan 310"
                          maxLength={50}
                          className="w-full bg-deep/5 border border-transparent focus:border-teal rounded-xl px-4 py-3 text-deep text-sm placeholder-deep/25 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Paso 2 — Confirmación ── */}
            {paso === 2 && (
              <motion.div
                key="paso2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <h2 className="text-deep font-bold text-lg mb-1">
                  Revisá tu solicitud
                </h2>
                <p className="text-deep/40 text-sm mb-5">
                  Confirmá los datos antes de enviar
                </p>

                <div className="space-y-3 mb-6">
                  {dependientes.length > 0 && (
                    <Row
                      label="Para"
                      value={form.paraMi ? "Vos" : form.dependienteNombre}
                    />
                  )}
                  <Row label="Especialidad" value={form.especialidadNombre} />
                  <Row label="Motivo de consulta" value={form.motivo} />
                  <Row
                    label="Médico preferido"
                    value={
                      form.doctorId
                        ? (() => {
                            const m = medicos.find(
                              (x) => String(x.id) === form.doctorId,
                            );
                            return m ? `Dr. ${m.nombre} ${m.apellido}` : "—";
                          })()
                        : "Sin preferencia"
                    }
                  />
                  <Row
                    label="Obra social"
                    value={
                      form.obraSocialId
                        ? (() => {
                            const os = obrasSociales.find(
                              (x) => String(x.id) === String(form.obraSocialId),
                            );
                            return os?.nombre ?? "—";
                          })()
                        : "Particular / Sin obra social"
                    }
                  />
                  {form.obraSocialId && form.numeroAfiliadoDeclarado && (
                    <Row
                      label="N° de afiliado"
                      value={form.numeroAfiliadoDeclarado}
                    />
                  )}
                  {form.obraSocialId && form.planAfiliadoDeclarado && (
                    <Row label="Plan" value={form.planAfiliadoDeclarado} />
                  )}
                </div>

                {submitError && (
                  <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4">
                    {submitError}
                  </p>
                )}

                <div className="bg-sky/10 border border-sky/20 rounded-xl px-4 py-3 text-sky text-xs leading-relaxed">
                  Tu turno quedará como <strong>pendiente</strong> hasta que el
                  equipo de secretaría lo confirme y te asigne fecha y hora.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botones de navegación */}
        <div className="flex gap-3 mt-4">
          {paso < 2 && (
            <button
              onClick={avanzar}
              className="flex-1 bg-deep text-mint font-bold text-sm py-4 rounded-xl hover:bg-navy transition-colors"
            >
              Continuar
            </button>
          )}
          {paso === 2 && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-deep text-mint font-bold text-sm py-4 rounded-xl hover:bg-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Enviar solicitud"
              )}
            </button>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-bold text-deep/35 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-deep text-sm font-medium">{value}</span>
    </div>
  );
}
