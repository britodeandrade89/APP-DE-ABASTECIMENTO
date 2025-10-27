
import React, { useState } from 'react';
import { CloseIcon, LoadingSpinner, SparklesIcon } from './Icons.tsx';
import { getTripEstimateFromGemini } from '../services/geminiService.ts';

interface TripModalProps {
    isOpen: boolean;
    onClose: () => void;
    overallAvgKmpl: number;
}

export const TripModal: React.FC<TripModalProps> = ({ isOpen, onClose, overallAvgKmpl }) => {
    const [distance, setDistance] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = async () => {
        const distNum = parseInt(distance);
        if (isNaN(distNum) || distNum <= 0) {
            setResult("<p>Por favor, insira uma distância válida.</p>");
            return;
        }

        setIsLoading(true);
        setResult('');
        const estimate = await getTripEstimateFromGemini(distNum, overallAvgKmpl);
        setResult(estimate);
        setIsLoading(false);
    };
    
    const handleClose = () => {
        setResult('');
        setDistance('');
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-[var(--theme-card-bg)] text-gray-200 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 modal-content">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Estimar Custo da Viagem</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="trip-distance" className="block text-sm font-medium text-gray-300">Distância da Viagem (km)</label>
                        <input 
                            type="number" 
                            id="trip-distance" 
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            placeholder="Ex: 350" 
                            className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]"
                        />
                    </div>
                    <button 
                        onClick={handleCalculate}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[var(--theme-gradient-start)] to-[var(--theme-gradient-end)] text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                    >
                       {isLoading ? <LoadingSpinner /> : <SparklesIcon />}
                       {isLoading ? 'Calculando...' : 'Calcular com IA'}
                    </button>
                    {result && (
                        <div className="mt-4 text-sm bg-black/20 p-4 rounded-lg gemini-analysis" dangerouslySetInnerHTML={{ __html: result }}></div>
                    )}
                </div>
            </div>
        </div>
    );
};
