'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(true)

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

  const cambiarEstado = async (id, nuevoEstado) => {
    const { error } = await supabase
      .from('citas')
      .update({ estado: nuevoEstado })
      .eq('id', id)

    if (error) {
      alert('Error al actualizar el estado')
    } else {
      cargarCitas()
    }
  }

  useEffect(() => {
    cargarCitas()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
          Panel de Administración
        </h1>

        {cargando ? (
          <p className="text-gray-600 text-center">Cargando citas...</p>
        ) : citas.length === 0 ? (
          <p className="text-gray-600 text-center">No hay citas agendadas aún.</p>
        ) : (
          <div>
            {/* VISTA MÓVIL: Tarjetas verticales */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
              {citas.map((cita) => (
                <div key={cita.id} className="bg-white p-4 rounded-xl shadow border border-gray-200 text-black">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="font-bold text-lg">{cita.nombre_cliente}</h2>
                      <p className="text-sm text-gray-600">📞 {cita.telefono}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      cita.estado === 'completada' ? 'bg-green-100 text-green-800' :
                      cita.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cita.estado || 'pendiente'}
                    </span>
                  </div>
                  
                  <div className="text-sm my-3 space-y-1">
                    <p><strong>Servicio:</strong> {cita.servicio}</p>
                    <p><strong>Fecha:</strong> {new Date(cita.fecha_hora).toLocaleString()}</p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => cambiarEstado(cita.id, 'completada')}
                      className="flex-1 bg-green-600 text-white py-2 rounded text-sm font-semibold hover:bg-green-700"
                    >
                      ✓ Completar
                    </button>
                    <button 
                      onClick={() => cambiarEstado(cita.id, 'cancelada')}
                      className="flex-1 bg-red-600 text-white py-2 rounded text-sm font-semibold hover:bg-red-700"
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* VISTA ESCRITORIO: Tabla tradicional (se oculta en móviles) */}
            <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-hidden">
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
          </div>
        )}
      </div>
    </main>
  )
}