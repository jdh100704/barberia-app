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

  // Cambia esto por tu número real para probarlo
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

  // Clases compartidas para los inputs
  const inputClasses = "w-full p-4 bg-[#1e1e1e] border border-gray-800 rounded-xl focus:ring-2 focus:ring-[#c6a87d] focus:border-[#c6a87d] outline-none text-gray-100 placeholder-gray-600 transition duration-150"

  return (
    <main className="min-h-screen bg-[#121212] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo decorativo sutil (un degradado radial) */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

      <div className="bg-[#1a1a1a] p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-lg w-full text-gray-200 border border-gray-800 relative z-10 transition-all duration-300">
        
        {/* Cabecera Premium */}
        <div className="text-center mb-10">
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-[#c6a87d] tracking-tight">
            The Gent's Club
          </h1>
          <p className="text-gray-500 mt-2 text-sm tracking-widest uppercase">
            Barbería & Estilo Masculino
          </p>
          <div className="w-24 h-px bg-[#c6a87d] mx-auto mt-5 opacity-60"></div>
        </div>

        {mensajeCompleto ? (
          <div className="text-center space-y-6">
            <div className="bg-[#1e1e1e] border border-emerald-900 text-emerald-300 p-6 rounded-2xl shadow-inner">
              <p className="font-bold text-xl">¡Cita agendada, Caballero!</p>
              <p className="text-sm mt-2 text-emerald-400/80">
                Su reserva para <span className="text-emerald-200">{datosReserva.servicio}</span> ha sido registrada.
                Para garantizar su lugar, por favor confirme por WhatsApp.
              </p>
            </div>

            <a
              href={obtenerLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#c6a87d] text-[#121212] font-bold py-4 px-6 rounded-xl hover:bg-[#b5966c] transition duration-200 transform hover:scale-[1.02] shadow-lg text-lg"
            >
              <span>💬 Confirmar por WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setMensajeCompleto(false)
                setFormData({ nombre_cliente: '', telefono: '', servicio: 'Corte Premium', fecha_hora: '' })
              }}
              className="text-sm text-gray-600 hover:text-gray-400 underline block mx-auto pt-3 transition"
            >
              Agendar otra cita
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-6 text-center">
              Reserva de Servicios Online
            </h2>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Nombre Completo</label>
              <input
                type="text"
                name="nombre_cliente"
                required
                placeholder="Ej. Ramón García"
                value={formData.nombre_cliente}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Teléfono Movil</label>
              <input
                type="tel"
                name="telefono"
                required
                placeholder="Ej. 600 123 456"
                value={formData.telefono}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Servicio</label>
                <div className="relative">
                  <select
                    name="servicio"
                    value={formData.servicio}
                    onChange={handleChange}
                    className={`${inputClasses} appearance-none pr-10`}
                  >
                    <option value="Corte Premium">Corte Premium</option>
                    <option value="Arreglo de Barba">Arreglo de Barba</option>
                    <option value="Ritual Completo">Ritual Completo</option>
                  </select>
                  {/* Icono de flecha personalizado */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  name="fecha_hora"
                  required
                  value={formData.fecha_hora}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#111111] text-[#c6a87d] border border-[#c6a87d]/40 font-bold py-4 rounded-xl hover:bg-[#c6a87d] hover:text-[#121212] transition duration-300 transform hover:scale-[1.01] shadow-lg text-lg mt-8"
            >
              {cargando ? 'Registrando...' : 'Reservar Experiencia'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}