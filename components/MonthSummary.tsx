
import React, { useState, useMemo } from 'react';
import type { ProcessedFuelEntry } from '../types.ts';
import { LoadingSpinner, SearchIcon } from './Icons.tsx';
import { getAnalysisFromGemini } from '../services/geminiService.ts';

interface MonthSummaryProps {
    entries: ProcessedFuelEntry[];
    filterValue: string;
}

export const MonthSummary: React.FC<MonthSummaryProps> = ({ entries, filterValue }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');

    const monthName = useMemo(() => {
        if (!filterValue || filterValue === 'all') return '';
        const [year, month] = filterValue.split('-');
        return new Date(Date.UTC(parseInt(year), parseInt(month) - 1))
            .toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' });
    }, [filterValue]);
    
    const stats = useMemo(() => {
        const totalSpent = entries.reduce((acc, curr) => acc + curr.totalValue, 0);
        const totalDistance = entries.reduce((acc, curr) => acc + curr.distance, 0);
        const totalLiters = entries.reduce((acc, curr) => acc + curr.liters, 0);
        const averageKmpl = totalLiters > 0 ? totalDistance / totalLiters : 0;
        return { totalSpent, totalDistance, totalLiters, averageKmpl };
    }, [entries]);

    const handleAnalysisClick = async () => {
        setIsLoading(true);
        setAnalysisResult('');
        const analysis = await getAnalysisFromGemini(entries, monthName);
        setAnalysisResult(analysis);
        setIsLoading(false);
    };

    if (!filterValue || filterValue === 'all' || entries.length === 0) {
        return null;
    }

    return (
        <section className="mb-8">
            <div className="bg-[var(--theme-card-bg)] text-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold capitalize">{monthName}</h3>
                <p className="text-gray-400 mb-6">Resumo do seu desempenho no mês.</p>
                <div className="grid grid-cols-2 gap-5 text-left">
                    <div className="bg-black/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Gasto Total</p>
                        <p className="text-2xl font-semibold">R$ {stats.totalSpent.toFixed(2)}</p>
                    </div>
                     <div className="bg-black/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Distância Total</p>
                        <p className="text-2xl font-semibold">{stats.totalDistance.toFixed(0)} km</p>
                    </div>
                     <div className="bg-black/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Litros</p>
                        <p className="text-2xl font-semibold">{stats.totalLiters.toFixed(2)} L</p>
                    </div>
                     <div className="bg-black/20 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Média Geral</p>
                        <p className="text-2xl font-semibold">{stats.averageKmpl.toFixed(1)} km/L</p>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <button 
                        onClick={handleAnalysisClick} 
                        disabled={isLoading}
                        className="flex items-center justify-center w-full sm:w-auto sm:mx-auto gap-2 bg-gradient-to-br from-[var(--theme-gradient-start)] to-[var(--theme-gradient-end)] hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                        {isLoading ? <LoadingSpinner /> : <SearchIcon />}
                        {isLoading ? 'Analisando...' : 'Analisar Mês com IA'}
                    </button>
                    {analysisResult && (
                        <div className="mt-4 text-sm text-left bg-black/20 p-4 rounded-lg w-full gemini-analysis" dangerouslySetInnerHTML={{ __html: analysisResult }}></div>
                    )}
                </div>
            </div>
        </section>
    );
};
