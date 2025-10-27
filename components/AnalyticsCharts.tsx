import React, { useMemo, useState } from 'react';
import type { ProcessedFuelEntry } from '../types.ts';
import {
    ResponsiveContainer,
    LineChart,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
    Bar
} from 'recharts';

interface AnalyticsChartsProps {
    entries: ProcessedFuelEntry[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 p-3 rounded-lg text-white">
                <p className="label font-bold mb-2">{label}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.color }}>
                        {`${pld.name}: ${pld.dataKey.includes('price') || pld.dataKey.includes('spent') ? 'R$ ' : ''}${pld.value.toFixed(pld.dataKey.includes('price') ? 3 : pld.dataKey.includes('spent') ? 2 : 1)}${pld.dataKey.includes('kmpl') ? ' km/L' : ''}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};


export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ entries }) => {
    const years = useMemo(() => {
        const uniqueYears = [...new Set(entries.map(e => e.date.getUTCFullYear()))];
        // Fix: Explicitly type `a` and `b` as numbers to resolve the arithmetic operation error.
        return uniqueYears.sort((a: number, b: number) => b - a);
    }, [entries]);

    const [selectedYear, setSelectedYear] = useState(() => years.length > 0 ? years[0] : new Date().getFullYear());

    const chartData = useMemo(() => {
        const yearEntries = entries.filter(e => e.date.getUTCFullYear() === selectedYear);

        const monthlyData: { [key: string]: { totalSpent: number, prices: number[], kmpls: number[], count: number } } = {};

        for (const entry of yearEntries) {
            const month = entry.date.getUTCMonth(); // 0-11
            if (!monthlyData[month]) {
                monthlyData[month] = { totalSpent: 0, prices: [], kmpls: [], count: 0 };
            }
            monthlyData[month].totalSpent += entry.totalValue;
            monthlyData[month].prices.push(entry.pricePerLiter);
            if (entry.avgKmpl > 0) {
                 monthlyData[month].kmpls.push(entry.avgKmpl);
            }
            monthlyData[month].count++;
        }

        const data = Array.from({ length: 12 }, (_, i) => {
            const monthData = monthlyData[i];
            const monthName = new Date(selectedYear, i).toLocaleString('pt-BR', { month: 'short' });
            if (!monthData) {
                return { name: monthName, totalSpent: 0, avgPrice: 0, avgKmpl: 0 };
            }
            const avgPrice = monthData.prices.reduce((a, b) => a + b, 0) / monthData.prices.length;
            const avgKmpl = monthData.kmpls.reduce((a, b) => a + b, 0) / (monthData.kmpls.length || 1);
            
            return {
                name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                totalSpent: monthData.totalSpent,
                avgPrice: avgPrice,
                avgKmpl: avgKmpl,
            };
        });

        return data;

    }, [entries, selectedYear]);
    
    if (entries.length === 0) {
        return null;
    }

    return (
        <section className="mb-8">
            <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-green-800/70 to-black/40 p-3 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-white">Análise Gráfica</h2>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                >
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-[var(--theme-card-bg)] p-4 rounded-xl shadow-lg h-72">
                     <h3 className="text-lg font-semibold text-gray-200 mb-4">Gasto Mensal (R$)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 20 }}>
                           <defs>
                                <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}}/>
                            <Bar dataKey="totalSpent" name="Gasto Total" fill="url(#colorSpent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-[var(--theme-card-bg)] p-4 rounded-xl shadow-lg h-72">
                     <h3 className="text-lg font-semibold text-gray-200 mb-4">Consumo (km/L) e Preço (R$/L)</h3>
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" stroke="#60a5fa" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="#facc15" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />}/>
                            <Legend wrapperStyle={{fontSize: "12px", paddingTop: "20px"}} />
                            <Line yAxisId="left" type="monotone" dataKey="avgKmpl" name="Média km/L" stroke="#60a5fa" strokeWidth={2} dot={{ r: 4, fill: '#60a5fa' }} activeDot={{ r: 6 }} />
                            <Line yAxisId="right" type="monotone" dataKey="avgPrice" name="Preço/Litro" stroke="#facc15" strokeWidth={2} dot={{ r: 4, fill: '#facc15' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
};