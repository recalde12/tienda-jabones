// src/components/LoyaltyLevel.tsx

export function LoyaltyLevel({ orderCount }: { orderCount: number }) {
  // Definimos los niveles
  const levels = [
    { name: "Bronce", min: 0, color: "bg-orange-700 text-orange-100", border: "border-orange-700" },
    { name: "Plata", min: 15, color: "bg-slate-400 text-white", border: "border-slate-400" },
    { name: "Oro", min: 30, color: "bg-yellow-500 text-white", border: "border-yellow-500" },
    { name: "Diamante", min: 45, color: "bg-cyan-500 text-white", border: "border-cyan-500" },
    { name: "Platino", min: 60, color: "bg-stone-900 text-white", border: "border-stone-900" },
  ];

  // Calcular nivel actual
  // Buscamos el nivel más alto cuyo mínimo sea menor o igual a nuestros pedidos
  const currentLevelIndex = levels.slice().reverse().findIndex(l => orderCount >= l.min);
  // Como invertimos el array, ajustamos el índice
  const actualIndex = currentLevelIndex >= 0 ? levels.length - 1 - currentLevelIndex : 0;
  
  const currentLevel = levels[actualIndex];
  const nextLevel = levels[actualIndex + 1];

  // Calcular progreso hacia el siguiente nivel
  let progressPercent = 100;
  let ordersNeeded = 0;

  if (nextLevel) {
    const ordersInThisLevel = orderCount - currentLevel.min;
    const totalToNext = nextLevel.min - currentLevel.min;
    progressPercent = Math.floor((ordersInThisLevel / totalToNext) * 100);
    ordersNeeded = nextLevel.min - orderCount;
  }

  return (
    <div className={`p-6 rounded-lg shadow-md border-2 ${currentLevel.border} bg-white mb-8`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Nivel VIP</h2>
          <p className="text-stone-500">Tu estatus actual</p>
        </div>
        <div className={`px-6 py-2 rounded-full font-bold font-serif text-xl shadow-sm ${currentLevel.color}`}>
          {currentLevel.name}
        </div>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-4 overflow-hidden mb-2">
        <div 
          className={`h-4 rounded-full transition-all duration-1000 ${currentLevel.color.split(" ")[0]}`} 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {nextLevel ? (
        <p className="text-sm text-stone-600 text-right">
          Te faltan <strong>{ordersNeeded} pedidos</strong> para alcanzar el nivel {nextLevel.name} y recibir tu premio.
        </p>
      ) : (
        <p className="text-sm text-stone-600 text-right">
          ¡Has alcanzado el máximo nivel! Eres una leyenda de Malaura.
        </p>
      )}
    </div>
  );
}