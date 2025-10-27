
import React, { useState, useEffect } from 'react';
import type { MaintenanceData } from '../types.ts';
import { CloseIcon } from './Icons.tsx';

interface MaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: MaintenanceData) => void;
    currentMileage: number;
    initialData: MaintenanceData;
}

const MaintenanceStatus: React.FC<{currentMileage: number; maintenanceData: MaintenanceData}> = ({ currentMileage, maintenanceData }) => {
    const maintenanceItems = [
        { id: 'oil' as keyof MaintenanceData, name: 'Troca de Óleo', interval: 10000, warning: 9000 },
        { id: 'tires' as keyof MaintenanceData, name: 'Troca de Pneus', interval: 25000, warning: 24000 },
        { id: 'engine' as keyof MaintenanceData, name: 'Revisão do Motor', interval: 50000, warning: 48000 }
    ];

    const hasRecords = Object.values(maintenanceData).some(val => (val as number) > 0);

    if (!hasRecords) {
        return <p className="text-center text-gray-400">Registre a quilometragem da sua última manutenção para começar a monitorar.</p>;
    }
    
    return (
        <div className="space-y-4">
            {maintenanceItems.map(item => {
                const lastServiceKm = maintenanceData[item.id] || 0;
                if (lastServiceKm === 0) return null;

                const nextServiceKm = lastServiceKm + item.interval;
                const kmRemaining = nextServiceKm - currentMileage;

                let statusColor: 'green' | 'yellow' | 'red' = 'green';
                let statusText = `Faltam ${kmRemaining.toLocaleString('pt-BR')} km`;

                if (currentMileage >= nextServiceKm) {
                    statusColor = 'red';
                    statusText = `Vencido há ${Math.abs(kmRemaining).toLocaleString('pt-BR')} km`;
                } else if (currentMileage >= lastServiceKm + item.warning) {
                    statusColor = 'yellow';
                    statusText = `Atenção! Faltam ${kmRemaining.toLocaleString('pt-BR')} km`;
                }

                const colorClasses = {
                    green: { bg: 'bg-green-900/50', text: 'text-green-300', border: 'border-green-700' },
                    yellow: { bg: 'bg-yellow-900/50', text: 'text-yellow-300', border: 'border-yellow-700' },
                    red: { bg: 'bg-red-900/50', text: 'text-red-300', border: 'border-red-700' }
                };
                const classes = colorClasses[statusColor];

                return (
                    <div key={item.id} className={`p-4 rounded-lg border ${classes.bg} ${classes.border}`}>
                        <h4 className={`font-bold text-md ${classes.text}`}>{item.name}</h4>
                        <div className={`text-sm ${classes.text} mt-2 grid grid-cols-2 gap-2`}>
                            <p><strong>Última:</strong> {lastServiceKm.toLocaleString('pt-BR')} km</p>
                            <p><strong>Próxima:</strong> {nextServiceKm.toLocaleString('pt-BR')} km</p>
                        </div>
                        <div className={`mt-3 text-center font-semibold ${classes.text} p-2 rounded`}>
                           {statusText}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose, onSave, currentMileage, initialData }) => {
    const [oil, setOil] = useState('');
    const [tires, setTires] = useState('');
    const [engine, setEngine] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle'|'saved'>('idle');

    useEffect(() => {
        if (isOpen) {
            setOil(initialData.oil > 0 ? String(initialData.oil) : '');
            setTires(initialData.tires > 0 ? String(initialData.tires) : '');
            setEngine(initialData.engine > 0 ? String(initialData.engine) : '');
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            oil: parseInt(oil) || 0,
            tires: parseInt(tires) || 0,
            engine: parseInt(engine) || 0,
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-[var(--theme-card-bg)] text-gray-200 rounded-xl shadow-2xl p-8 w-full max-w-lg m-4 modal-content overflow-y-auto max-h-[95vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Gerenciar Manutenção</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                </div>
                <div className="space-y-6">
                    <div className="text-center bg-black/30 p-3 rounded-lg">
                        <p className="text-sm text-gray-400">Quilometragem Atual do Veículo</p>
                        <p className="text-3xl font-bold text-white">{currentMileage.toLocaleString('pt-BR')} km</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-white/10 rounded-lg">
                        <h3 className="font-semibold text-lg border-b border-white/10 pb-2 text-white">Registrar Última Manutenção</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="last-oil-change" className="block text-sm font-medium text-gray-300">Troca de Óleo (km)</label>
                                <input type="number" id="last-oil-change" value={oil} onChange={e => setOil(e.target.value)} placeholder="130000" className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm"/>
                            </div>
                            <div>
                                <label htmlFor="last-tire-change" className="block text-sm font-medium text-gray-300">Troca de Pneus (km)</label>
                                <input type="number" id="last-tire-change" value={tires} onChange={e => setTires(e.target.value)} placeholder="120000" className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm"/>
                            </div>
                            <div>
                                <label htmlFor="last-engine-revision" className="block text-sm font-medium text-gray-300">Revisão do Motor (km)</label>
                                <input type="number" id="last-engine-revision" value={engine} onChange={e => setEngine(e.target.value)} placeholder="100000" className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm"/>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-gradient-to-br from-[var(--theme-gradient-start)] to-[var(--theme-gradient-end)] text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-colors w-36">
                                {saveStatus === 'saved' ? 'Salvo!' : 'Salvar Registros'}
                            </button>
                        </div>
                    </form>
                    <div>
                        <h3 className="font-semibold text-lg border-b border-white/10 pb-2 mb-4 text-white">Status da Próxima Revisão</h3>
                        <MaintenanceStatus currentMileage={currentMileage} maintenanceData={initialData} />
                    </div>
                </div>
            </div>
        </div>
    );
};
