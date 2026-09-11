'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    telefono: '',
    servicio: 'Corte de Pelo',
    fecha_hora: ''
  })
  const [cargando, setCargando] = useState(false)
  const [mensajeCompleto, setMensajeCompleto] = useState(false)
  const [datosReserva, setDatosReserva] = useState(null)

  // Número de WhatsApp de la barbería (incluye el prefijo del país, ej: 34 para España)
  const TELEFONO_BARBERIA = '34644616651' 

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

  // Crear el mensaje de WhatsApp codificado para URL
  const obtenerLinkWhatsApp = () => {
    if (!datosReserva) return ''
    const fechaFormateada = new Date(datosReserva.fecha_hora).toLocaleString()
    const texto = `¡Hola! Acabo de agendar una cita.%0A%0A*Nombre:* ${datosReserva.nombre_cliente}%0A*Servicio:* ${datosReserva.servicio}%0A*Fecha y Hora:* ${fechaFormateada}%0A%0A¡Quedo a la espera de su confirmación!`
    return `https://wa.me/${TELEFONO_BARBERIA}?text=${texto}`
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-md w-full text-black">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Reserva tu Cita
        </h1>

        {mensajeCompleto ? (
          <div className="text-center space-y-4">
            <div className="bg-green-100 text-green-800 p-4 rounded-xl">
              <p className="font-bold text-lg">¡Cita registrada con éxito!</p>
              <p className="text-sm mt-1">Para asegurar tu lugar, confirma tu reserva enviando un mensaje por WhatsApp.</p>
            </div>

            <a
              href={obtenerLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 transition duration-200"
            >
              <span>💬 Confirmar por WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setMensajeCompleto(false)
                setFormData({ nombre_cliente: '', telefono: '', servicio: 'Corte de Pelo', fecha_hora: '' })
              }}
              className="text-sm text-gray-500 underline block mx-auto pt-2"
            >
              Agendar otra cita
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                name="nombre_cliente"
                required
                value={formData.nombre_cliente}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                required
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
              <select
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white"
              >
                <option value="Corte de Pelo">Corte de Pelo</option>
                <option value="Barba">Barba</option>
                <option value="Corte + Barba">Corte + Barba</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
              <input
                type="datetime-local"
                name="fecha_hora"
                required
                value={formData.fecha_hora}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition duration-200"
            >
              {cargando ? 'Agendando...' : 'Confirmar Reserva'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}