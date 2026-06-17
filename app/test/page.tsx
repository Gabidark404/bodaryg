import Image from 'next/image'

export default function TestPage() {
  // Los números de los PNGs que acabas de subir: 5 al 14
  const pngs = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

  return (
    <div className="p-10 bg-white min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-8">Tus PNGs subidos:</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
        {pngs.map((num) => (
          <div key={num} className="border-2 border-gray-300 p-4 rounded-xl flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-red-600">item-{num}.png</h2>
            <div className="relative w-full h-64 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src={`/item-${num}.png`} 
                alt={`Item ${num}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
