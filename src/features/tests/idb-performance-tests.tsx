import Dexie from "dexie";
import { useEffect, useState } from "react";

// Definir la base de datos
class FinanceDB extends Dexie {
  transactions: Dexie.Table<Transaction, number>;

  constructor() {
    super("FinanceTestDB");

    this.version(1).stores({
      transactions: "++id, type, archive, date",
    });

    this.version(2).stores({
      transactions: "++id, type, archive, date, [type+archive]",
    });

    this.version(3).stores({
      transactions:
        "++id, type, archive, date, [type+archive], [type+archive+date]",
    });

    this.transactions = this.table("transactions");
  }
}

interface Transaction {
  id?: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: Date;
  archive: 0 | 1;
}

const db = new FinanceDB();

export function IDBPerformanceTests() {
  const [count, setCount] = useState(5000);
  const [isSeeding, setIsSeeding] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    updateCount();
  }, []);

  const updateCount = async () => {
    const total = await db.transactions.count();
    setTotalRecords(total);
  };

  const seedData = async () => {
    setIsSeeding(true);
    setResults([]);

    try {
      console.log(`Generando ${count} transacciones...`);

      const transactions: Transaction[] = [];
      const now = new Date();

      for (let i = 0; i < count; i++) {
        const daysAgo = Math.floor(Math.random() * 730);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);

        transactions.push({
          type: Math.random() > 0.3 ? "expense" : "income",
          amount: Math.floor(Math.random() * 5000) + 10,
          description: `Transacción ${i + 1}`,
          date,
          archive: Math.random() > 0.9 ? 1 : 0,
        });
      }

      // Insertar en lotes
      const batchSize = 100;
      for (let i = 0; i < transactions.length; i += batchSize) {
        const batch = transactions.slice(i, i + batchSize);
        await db.transactions.bulkAdd(batch);
      }

      await updateCount();
      console.log("✅ Seed completado");
    } catch (error) {
      console.error("Error al generar datos:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  const clearData = async () => {
    if (confirm(`¿Eliminar ${totalRecords} transacciones?`)) {
      await db.transactions.clear();
      await updateCount();
      setResults([]);
      console.log("✅ Datos eliminados");
    }
  };

  const runTests = async () => {
    setIsTesting(true);
    const testResults: any[] = [];

    try {
      // Test 1: where(type).equals().and()
      const start1 = performance.now();
      const result1 = await db.transactions
        .where("type")
        .equals("income")
        .and((txn) => txn.archive === 0)
        .toArray();
      const end1 = performance.now();

      testResults.push({
        name: "where(type).and(archive)",
        time: (end1 - start1).toFixed(2),
        results: result1.length,
        index: "type (simple)",
        color: "bg-red-100 border-red-300",
      });

      // Test 2: where([type+archive])
      const start2 = performance.now();
      const result2 = await db.transactions
        .where("[type+archive]")
        .equals(["income", 0])
        .toArray();
      const end2 = performance.now();

      testResults.push({
        name: "where([type+archive])",
        time: (end2 - start2).toFixed(2),
        results: result2.length,
        index: "[type+archive]",
        color: "bg-yellow-100 border-yellow-300",
      });

      // Test 3: where([type+archive+date])
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const start3 = performance.now();
      const result3 = await db.transactions
        .where("[type+archive+date]")
        .between(
          ["income", 0, lastMonth],
          ["income", 0, new Date()],
          true,
          true,
        )
        .toArray();
      const end3 = performance.now();

      testResults.push({
        name: "where([type+archive+date])",
        time: (end3 - start3).toFixed(2),
        results: result3.length,
        index: "[type+archive+date]",
        color: "bg-green-100 border-green-300",
      });

      // Ordenar por tiempo (más rápido primero)
      testResults.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));

      setResults(testResults);

      console.log("📊 Resultados:");
      testResults.forEach((r, i) => {
        console.log(
          `${i + 1}. ${r.name}: ${r.time}ms (${r.results} resultados)`,
        );
      });
    } catch (error) {
      console.error("Error en tests:", error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white p-8 shadow-xl">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            🧪 IndexedDB Performance Tester
          </h1>
          <p className="mb-6 text-gray-600">
            Compara el rendimiento de diferentes estrategias de índices en
            Dexie.js
          </p>

          {/* Estado actual */}
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Registros en BD</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalRecords.toLocaleString()}
                </p>
              </div>
              <button
                onClick={updateCount}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>

          {/* Controles de seed */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Cantidad de transacciones a generar
                </label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  min="100"
                  step="100"
                />
              </div>

              <button
                onClick={seedData}
                disabled={isSeeding}
                className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSeeding
                  ? "⏳ Generando..."
                  : `✨ Generar ${count.toLocaleString()} transacciones`}
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={runTests}
                disabled={isTesting || totalRecords === 0}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isTesting
                  ? "⏳ Ejecutando tests..."
                  : "🚀 Ejecutar Tests de Performance"}
              </button>

              <button
                onClick={clearData}
                disabled={totalRecords === 0}
                className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                🗑️ Limpiar Base de Datos
              </button>
            </div>
          </div>

          {/* Resultados */}
          {results.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                📊 Resultados
              </h2>

              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`${result.color} rounded-lg border-2 p-4 transition-all hover:shadow-md`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-700">
                          #{index + 1}
                        </span>
                        <div>
                          <h3 className="font-mono font-semibold text-gray-800">
                            {result.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Índice:{" "}
                            <code className="rounded bg-white px-2 py-1">
                              {result.index}
                            </code>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-800">
                          {result.time}
                          <span className="text-lg">ms</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          {result.results.toLocaleString()} resultados
                        </p>
                      </div>
                    </div>

                    {/* Barra de progreso visual */}
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full bg-gray-700 transition-all duration-500"
                        style={{
                          width: `${(parseFloat(result.time) / parseFloat(results[results.length - 1].time)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Conclusión */}
              <div className="mt-6 rounded-lg border-2 border-green-300 bg-gradient-to-r from-green-50 to-blue-50 p-6">
                <h3 className="mb-2 text-lg font-bold text-gray-800">
                  ✅ Conclusión
                </h3>
                <p className="text-gray-700">
                  El índice{" "}
                  <code className="rounded bg-white px-2 py-1 font-semibold">
                    {results[0].index}
                  </code>{" "}
                  es{" "}
                  <span className="font-bold text-green-600">
                    {(
                      parseFloat(results[results.length - 1].time) /
                      parseFloat(results[0].time)
                    ).toFixed(1)}
                    x más rápido
                  </span>{" "}
                  que {results[results.length - 1].index}.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Diferencia:{" "}
                  {(
                    parseFloat(results[results.length - 1].time) -
                    parseFloat(results[0].time)
                  ).toFixed(2)}
                  ms
                </p>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-700">
              ℹ️ ¿Qué estamos probando?
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <strong>Test 1:</strong> Índice simple en <code>type</code> +
                filtro JS en <code>archive</code>
              </li>
              <li>
                <strong>Test 2:</strong> Índice compuesto{" "}
                <code>[type+archive]</code>
              </li>
              <li>
                <strong>Test 3:</strong> Índice compuesto{" "}
                <code>[type+archive+date]</code> con rango del último mes
              </li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              💡 Tip: Genera al menos 5,000 registros para ver diferencias
              significativas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
