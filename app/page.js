'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    telefono: '',
    servicio: 'Corte Premium',
    fecha_hora: ''
  })
  const [cargando, setCargando] = useState(false)
  const [mensajeCompleto, setMensajeCompleto] = useState(false)
  const [datosReserva, setDatosReserva] = useState(null)

  const TELEFONO_BARBERIA = '34600000000'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)

    const { data, error } = await supabase
      .from('citas')
      .insert([formData])

    if (error) {
      alert('Error al agendar la cita. Inténtalo de nuevo.')
    } else {
      setDatosReserva(formData)
      setMensajeCompleto(true)
    }
    setCargando(false)
  }

  const obtenerLinkWhatsApp = () => {
    if (!datosReserva) return ''
    const fechaFormateada = new Date(datosReserva.fecha_hora).toLocaleString()
    const texto = `¡Hola! Acabo de agendar una cita.%0A%0A*Nombre:* ${datosReserva.nombre_cliente}%0A*Servicio:* ${datosReserva.servicio}%0A*Fecha y Hora:* ${fechaFormateada}%0A%0A¡Quedo a la espera de su confirmación!`
    return `https://wa.me/${TELEFONO_BARBERIA}?text=${texto}`
  }

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
      <div className="bg-neutral-900 border border-neutral-800 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-lg w-full text-neutral-100">
        
        {/* Encabezado elegante con comillas corregidas */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif tracking-widest text-amber-500 uppercase font-bold mb-1">
            {"The Gent's Club"}
          </h1>
          <p className="text-xs text-neutral-400 tracking-widest uppercase mb-4">
            Barbería & Estilo Masculino
          </p>
          <div className="w-12 h-0.5 bg-amber-500/50 mx-auto rounded-full mb-6"></div>
          <h2 className="text-lg font-light text-neutral-200">
            Reserva de Servicios Online
          </h2>
        </div>

        {mensajeCompleto ? (
          <div className="text-center space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 p-5 rounded-2xl">
              <p className="font-semibold text-lg mb-1">¡Cita registrada con éxito!</p>
              <p className="text-xs text-amber-300/80">
                Para asegurar tu lugar, confirma tu reserva enviando un mensaje por WhatsApp.
              </p>
            </div>

            <a
              href={obtenerLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 px-4 rounded-xl transition duration-200 shadow-lg shadow-emerald-900/20"
            >
              <span>💬 Confirmar por WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setMensajeCompleto(false)
                setFormData({ nombre_cliente: '', telefono: '', servicio: 'Corte Premium', fecha_hora: '' })
              }}
              className="text-xs text-neutral-400 hover:text-amber-400 transition block mx-auto pt-2"
            >
              Agendar otra cita
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                name="nombre_cliente"
                required
                placeholder="Ej. Ramón García"
                value={formData.nombre_cliente}
                onChange={handleChange}
                className="w-full bg-neutral-800/60 border border-neutral-700/60 rounded-xl p-3.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Teléfono Móvil
              </label>
              <input
                type="tel"
                name="telefono"
                required
                placeholder="Ej. 600 123 456"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full bg-neutral-800/60 border border-neutral-700/60 rounded-xl p-3.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Servicio
                </label>
                <select
                  name="servicio"
                  value={formData.servicio}
                  onChange={handleChange}
                  className="w-full bg-neutral-800/60 border border-neutral-700/60 rounded-xl p-3.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition cursor-pointer"
                >
                  <option value="Corte Premium" className="bg-neutral-900 text-white">Corte Premium</option>
                  <option value="Arreglo de Barba" className="bg-neutral-900 text-white">Arreglo de Barba</option>
                  <option value="Ritual Completo" className="bg-neutral-900 text-white">Ritual Completo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  name="fecha_hora"
                  required
                  value={formData.fecha_hora}
                  onChange={handleChange}
                  className="w-full bg-neutral-800/60 border border-neutral-700/60 rounded-xl p-3.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full mt-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-lg shadow-amber-500/10 uppercase text-xs tracking-widest cursor-pointer"
            >
              {cargando ? 'Reservando...' : 'Reservar Experiencia'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}