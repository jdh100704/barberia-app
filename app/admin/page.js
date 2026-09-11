'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(true)

  // Cargar la lista de citas desde Supabase
  const cargarCitas = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .order('fecha_hora', { ascending: true })

    if (error) {
      console.error('Error al cargar citas:', error)
    } else {
      setCitas(data || [])
    }
    setCargando(false)
  }

  // Cambiar estado de la cita (Completada o Cancelada)
  const cambiarEstado = async (id, nuevoEstado) => {
    const { error } = await supabase
      .from('citas')
      .update({ estado: nuevoEstado })
      .eq('id', id)

    if (error) {
      alert('Error al actualizar el estado')
    } else {
      cargarCitas() // Recargar lista actualizada
    }
  }

  useEffect(() => {
    cargarCitas()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administración - Citas</h1>

        {cargando ? (
          <p className="text-gray-600">Cargando citas...</p>
        ) : citas.length === 0 ? (
          <p className="text-gray-600">No hay citas agendadas aún.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Teléfono</th>
                  <th className="p-4">Servicio</th>
                  <th className="p-4">Fecha / Hora</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-black">
                {citas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{cita.nombre_cliente}</td>
                    <td className="p-4">{cita.telefono}</td>
                    <td className="p-4">{cita.servicio}</td>
                    <td className="p-4">{new Date(cita.fecha_hora).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        cita.estado === 'completada' ? 'bg-green-100 text-green-800' :
                        cita.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cita.estado || 'pendiente'}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button 
                        onClick={() => cambiarEstado(cita.id, 'completada')}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={() => cambiarEstado(cita.id, 'cancelada')}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}