'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [form, setForm] = useState({ nombre: '', telefono: '', servicio: 'Corte de Pelo', fecha: '' })
  const [mensaje, setMensaje] = useState('')
  const [esError, setEsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Guardamos el intento en la base de datos
    const { data, error } = await supabase.from('citas').insert([
      { 
        nombre_cliente: form.nombre, 
        telefono: form.telefono, 
        servicio: form.servicio, 
        fecha_hora: form.fecha 
      }
    ])

    if (error) {
      // Imprime el detalle completo en la consola del navegador (F12)
      console.error('Error detallado de Supabase:', error)
      setEsError(true)
      setMensaje(`Error: ${error.message || 'No se pudo agendar la cita'}`)
    } else {
      setEsError(false)
      setMensaje('¡Cita agendada con éxito!')
      setForm({ nombre: '', telefono: '', servicio: 'Corte de Pelo', fecha: '' })
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reserva tu Cita</h1>
        
        {mensaje && (
          <p className={`mb-4 text-center font-semibold ${esError ? 'text-red-600' : 'text-green-600'}`}>
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input 
              type="text" 
              required 
              value={form.nombre}
              onChange={(e) => setForm({...form, nombre: e.target.value})}
              className="mt-1 w-full p-2 border rounded-md text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input 
              type="tel" 
              required 
              value={form.telefono}
              onChange={(e) => setForm({...form, telefono: e.target.value})}
              className="mt-1 w-full p-2 border rounded-md text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Servicio</label>
            <select 
              value={form.servicio}
              onChange={(e) => setForm({...form, servicio: e.target.value})}
              className="mt-1 w-full p-2 border rounded-md text-black"
            >
              <option value="Corte de Pelo">Corte de Pelo</option>
              <option value="Arreglo de Barba">Arreglo de Barba</option>
              <option value="Corte + Barba">Corte + Barba</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
            <input 
              type="datetime-local" 
              required 
              value={form.fecha}
              onChange={(e) => setForm({...form, fecha: e.target.value})}
              className="mt-1 w-full p-2 border rounded-md text-black"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition font-medium"
          >
            Confirmar Reserva
          </button>
        </form>
      </div>
    </main>
  )
}