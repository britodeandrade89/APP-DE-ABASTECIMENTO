import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import type { RawFuelEntry, ProcessedFuelEntry, MaintenanceEvent } from './types.ts';
import { ServiceType } from './types.ts';
import { EntryModal } from './components/EntryModal.tsx';
import { TripModal } from './components/TripModal.tsx';
import { MaintenanceModal } from './components/MaintenanceModal.tsx';
import { MonthSummary } from './components/MonthSummary.tsx';
import { EntryDetailModal } from './components/EntryDetailModal.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { AnalyticsCharts } from './components/AnalyticsCharts.tsx';
import { FuelPumpIcon, UserIcon, DollarSignIcon, GaugeIcon, RoadIcon, PlusIcon, CalculatorIcon, WrenchIcon, EditIcon, ExportIcon } from './components/Icons.tsx';

const StatsCard: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="stats-card bg-[var(--theme-card-bg)] p-4 rounded-xl flex items-center gap-4">
        <div className="bg-black/30 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
    const [rawEntries, setRawEntries] = useState<RawFuelEntry[]>([]);
    const [maintenanceLog, setMaintenanceLog] = useState<MaintenanceEvent[]>([]);
    const [activeModal, setActiveModal] = useState<'entry' | 'trip' | 'maintenance' | 'detail' | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<ProcessedFuelEntry | null>(null);
    const [entryToEdit, setEntryToEdit] = useState<RawFuelEntry | null>(null);
    const [monthFilter, setMonthFilter] = useState<string>('all');
    
    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    useEffect(() => {
        if (!isLoggedIn) return;
        try {
            const storedData = localStorage.getItem('fuelControlData');
            if (storedData) {
                const { entries, maintenance } = JSON.parse(storedData);
                const parsedEntries = entries.map((e: any) => ({
                    ...e,
                    date: new Timestamp(e.date.seconds, e.date.nanoseconds),
                }));
                 const parsedMaintenance = maintenance.map((m: any) => ({
                    ...m,
                    date: new Timestamp(m.date.seconds, m.date.nanoseconds),
                }));
                setRawEntries(parsedEntries);
                setMaintenanceLog(parsedMaintenance);
            } else {
                const { initialEntries, initialMaintenance } = getInitialSeedData();
                setRawEntries(initialEntries);
                setMaintenanceLog(initialMaintenance);
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
            const { initialEntries, initialMaintenance } = getInitialSeedData();
            setRawEntries(initialEntries);
            setMaintenanceLog(initialMaintenance);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            const dataToStore = {
                entries: rawEntries,
                maintenance: maintenanceLog,
            };
            localStorage.setItem('fuelControlData', JSON.stringify(dataToStore));
        }
    }, [rawEntries, maintenanceLog, isLoggedIn]);

    const processedEntries = useMemo((): ProcessedFuelEntry[] => {
        const sorted = [...rawEntries].sort((a, b) => a.date.toMillis() - b.date.toMillis() || a.kmEnd - b.kmEnd);
        
        const calculatedEntries = sorted.map((currentEntry, index) => {
            const nextEntry = index < sorted.length - 1 ? sorted[index + 1] : null;
            const kmStart = currentEntry.kmEnd;
            const liters = currentEntry.pricePerLiter > 0 ? currentEntry.totalValue / currentEntry.pricePerLiter : 0;
            let distance = 0;
            let avgKmpl = 0;

            if (nextEntry) {
                const kmEndAtNextRefuel = nextEntry.kmEnd;
                if (kmEndAtNextRefuel > kmStart) {
                    distance = kmEndAtNextRefuel - kmStart;
                }
                if (distance > 0 && liters > 0) {
                    avgKmpl = distance / liters;
                }
            }
            
            return {
                ...currentEntry,
                date: currentEntry.date.toDate(),
                liters,
                kmStart,
                distance,
                avgKmpl,
            };
        });
        return calculatedEntries.reverse();
    }, [rawEntries]);
    
    const currentMileage = useMemo(() => {
        return rawEntries.length > 0 ? Math.max(...rawEntries.map(e => e.kmEnd)) : 0;
    }, [rawEntries]);

    const filteredEntries = useMemo(() => {
        if (monthFilter === 'all') return processedEntries;
        return processedEntries.filter(e => {
            const entryMonth = `${e.date.getUTCFullYear()}-${String(e.date.getUTCMonth() + 1).padStart(2, '0')}`;
            return entryMonth === monthFilter;
        });
    }, [processedEntries, monthFilter]);

    const displayStats = useMemo(() => {
        const entriesToUse = monthFilter === 'all' ? processedEntries.filter(e => e.distance > 0) : filteredEntries.filter(e => e.distance > 0);
        const totalSpent = filteredEntries.reduce((sum, e) => sum + e.totalValue, 0);
        const totalDistance = entriesToUse.reduce((sum, e) => sum + e.distance, 0);
        const totalLiters = entriesToUse.reduce((sum, e) => sum + e.liters, 0);
        const averageKmpl = totalLiters > 0 ? totalDistance / totalLiters : 0;
        return { totalSpent, totalDistance, averageKmpl };
    }, [filteredEntries, processedEntries, monthFilter]);

    const availableMonths = useMemo(() => {
        const months = new Set(processedEntries.map(e => `${e.date.getUTCFullYear()}-${String(e.date.getUTCMonth() + 1).padStart(2, '0')}`));
        const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        months.add(currentMonth);
        return Array.from(months).sort((a: string, b: string) => b.localeCompare(a));
    }, [processedEntries]);
    
    const maintenanceReminders = useMemo(() => {
        const items = [
            { id: ServiceType.OIL_CHANGE, name: 'Troca de Óleo', interval: 10000, warning: 1000 },
            { id: ServiceType.TIRE_CHANGE, name: 'Troca de Pneus', interval: 25000, warning: 1000 },
            { id: ServiceType.ENGINE_REVIEW, name: 'Revisão do Motor', interval: 50000, warning: 2000 }
        ];

        if (!currentMileage || maintenanceLog.length === 0) return [];
        
        return items.map(item => {
            const lastService = maintenanceLog
                .filter(log => log.serviceType === item.id)
                .sort((a, b) => b.date.toMillis() - a.date.toMillis())[0];

            if (!lastService) return null;

            const nextServiceKm = lastService.mileage + item.interval;
            const kmRemaining = nextServiceKm - currentMileage;

            let status = 'ok';
            let message = '';

            if (currentMileage >= nextServiceKm) {
                status = 'overdue';
                message = `Vencido há ${Math.abs(kmRemaining).toLocaleString('pt-BR')} km`;
            } else if (currentMileage >= nextServiceKm - item.warning) {
                status = 'warning';
                message = `Faltam ${kmRemaining.toLocaleString('pt-BR')} km`;
            }

            return { ...item, status, message };
        }).filter((item): item is NonNullable<typeof item> => item !== null && item.status !== 'ok');

    }, [currentMileage, maintenanceLog]);
    
    const handleCloseModal = useCallback(() => {
        setActiveModal(null);
        setSelectedEntry(null);
        setEntryToEdit(null);
    }, []);

    const handleSaveEntry = useCallback((entryData: Omit<RawFuelEntry, 'id'> & { id?: string }) => {
        setRawEntries(prev => {
            if (entryData.id) {
                return prev.map(e => e.id === entryData.id ? { ...e, ...entryData } as RawFuelEntry : e);
            }
            return [...prev, { ...entryData, id: Date.now().toString() } as RawFuelEntry];
        });
        handleCloseModal();
    }, [handleCloseModal]);

    const handleDeleteEntry = useCallback((id: string) => {
        setRawEntries(prev => prev.filter(e => e.id !== id));
        handleCloseModal();
    }, [handleCloseModal]);

    const handleSaveMaintenance = useCallback((event: Omit<MaintenanceEvent, 'id'> & { id?: string }) => {
        setMaintenanceLog(prev => {
            if (event.id) {
                return prev.map(e => e.id === event.id ? { ...e, ...event } as MaintenanceEvent : e);
            }
            return [...prev, { ...event, id: Date.now().toString() } as MaintenanceEvent];
        });
    }, []);
    
    const handleDeleteMaintenance = useCallback((id: string) => {
         setMaintenanceLog(prev => prev.filter(e => e.id !== id));
    }, []);

    const handleExportCSV = useCallback(() => {
        if (rawEntries.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }

        const headers = ['id', 'date', 'totalValue', 'pricePerLiter', 'kmEnd', 'fuelType', 'notes'];
        
        const formatDate = (timestamp: Timestamp) => {
            const date = timestamp.toDate();
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const sortedEntries = [...rawEntries].sort((a, b) => a.date.toMillis() - b.date.toMillis());

        const csvRows = [
            headers.join(','),
            ...sortedEntries.map(entry => {
                const sanitizedNotes = `"${(entry.notes || '').replace(/"/g, '""')}"`;
                const row = [
                    entry.id,
                    formatDate(entry.date),
                    entry.totalValue.toFixed(2),
                    entry.pricePerLiter.toFixed(3),
                    entry.kmEnd,
                    entry.fuelType,
                    sanitizedNotes,
                ];
                return row.join(',');
            })
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'meu_combustivel_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [rawEntries]);

    const handleSelectEntry = (entry: ProcessedFuelEntry) => {
        setSelectedEntry(entry);
        setActiveModal('detail');
    }
    
    const handleEditClick = (entry: ProcessedFuelEntry) => {
         const rawEntryToEdit = rawEntries.find(e => e.id === entry.id);
        if (rawEntryToEdit) {
            setEntryToEdit(rawEntryToEdit);
            setActiveModal('entry');
        }
    }
    
    if (!isLoggedIn) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <div className="bg-black text-gray-200 min-h-screen font-sans">
             <header className="bg-gradient-to-r from-green-600 to-black p-4 sticky top-0 z-30 shadow-lg">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FuelPumpIcon size={28} className="text-white" />
                        <h1 className="text-2xl font-bold text-white tracking-wider">MEU COMBUSTÍVEL</h1>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-full bg-black/25">
                        <UserIcon />
                    </div>
                </div>
            </header>
            
            <main className="max-w-4xl mx-auto p-4 pb-24">
                <section className="mb-6">
                    <div className="bg-gradient-to-r from-green-800/70 to-black/40 p-3 rounded-lg mb-4 shadow-md">
                        <h2 className="text-xl font-semibold text-white">Visão Geral</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <StatsCard icon={<RoadIcon />} label="KM Atual" value={currentMileage.toLocaleString('pt-BR')} />
                       <StatsCard icon={<DollarSignIcon />} label={`Gasto ${monthFilter === 'all' ? 'Total' : 'do Mês'}`} value={`R$ ${displayStats.totalSpent.toFixed(2)}`} />
                       <StatsCard icon={<GaugeIcon />} label={`Distância ${monthFilter === 'all' ? 'Total' : 'do Mês'}`} value={`${displayStats.totalDistance.toFixed(0)} km`} />
                       <StatsCard icon={<GaugeIcon />} label={`Média ${monthFilter === 'all' ? 'Geral' : 'do Mês'}`} value={`${displayStats.averageKmpl.toFixed(1)} km/L`} />
                    </div>
                </section>
                
                <AnalyticsCharts entries={processedEntries} />

                {maintenanceReminders.length > 0 && (
                    <section className="mb-8">
                        <div className="bg-gradient-to-r from-yellow-800/70 to-red-800/40 p-3 rounded-lg mb-4 shadow-md">
                            <h2 className="text-xl font-semibold text-white">Lembretes de Manutenção</h2>
                        </div>
                        <div className="space-y-3">
                            {maintenanceReminders.map(reminder => (
                                <button 
                                    key={reminder.id}
                                    onClick={() => setActiveModal('maintenance')}
                                    className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-transform hover:scale-[1.02] ${
                                        reminder.status === 'warning'
                                            ? 'bg-yellow-900/50 border border-yellow-700'
                                            : 'bg-red-900/50 border border-red-700'
                                    }`}
                                >
                                    <div className={`p-2 rounded-full ${
                                        reminder.status === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                                    }`}>
                                    <WrenchIcon />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${
                                            reminder.status === 'warning' ? 'text-yellow-300' : 'text-red-300'
                                        }`}>{reminder.name}</p>
                                        <p className="text-sm text-gray-200">{reminder.message}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                )}
                
                <section className="mb-8">
                    <div className="bg-gradient-to-r from-green-800/70 to-black/40 p-3 rounded-lg mb-4 shadow-md">
                        <h2 className="text-xl font-semibold text-white">Ações Rápidas</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <button onClick={() => { setEntryToEdit(null); setActiveModal('entry'); }} className="flex items-center justify-center gap-3 bg-[var(--theme-card-bg)] hover:bg-gray-800/80 p-4 rounded-xl transition-colors text-center">
                            <PlusIcon /> <span className="font-semibold">Adicionar Abastecimento</span>
                        </button>
                        <button onClick={() => setActiveModal('trip')} className="flex items-center justify-center gap-3 bg-[var(--theme-card-bg)] hover:bg-gray-800/80 p-4 rounded-xl transition-colors text-center">
                            <CalculatorIcon /> <span className="font-semibold">Estimar Viagem</span>
                        </button>
                        <button onClick={() => setActiveModal('maintenance')} className="flex items-center justify-center gap-3 bg-[var(--theme-card-bg)] hover:bg-gray-800/80 p-4 rounded-xl transition-colors text-center">
                            <WrenchIcon /> <span className="font-semibold">Manutenção</span>
                        </button>
                        <button onClick={handleExportCSV} className="flex items-center justify-center gap-3 bg-[var(--theme-card-bg)] hover:bg-gray-800/80 p-4 rounded-xl transition-colors text-center">
                            <ExportIcon /> <span className="font-semibold">Exportar CSV</span>
                        </button>
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-green-800/70 to-black/40 p-3 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-white">Histórico de Abastecimentos</h2>
                        <select
                            value={monthFilter}
                            onChange={(e) => setMonthFilter(e.target.value)}
                            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                        >
                            <option value="all">Todos os Meses</option>
                            {availableMonths.map(month => (
                                <option key={month} value={month}>{new Date(month + '-02T00:00:00').toLocaleString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</option>
                            ))}
                        </select>
                    </div>

                    <MonthSummary entries={filteredEntries} filterValue={monthFilter} />

                    <div className="space-y-3">
                        {filteredEntries.length === 0 ? (
                             <div className="text-center text-gray-500 py-8 px-4 bg-[var(--theme-card-bg)] rounded-xl">
                                 <h3 className="text-lg font-semibold text-white">Nenhum registro encontrado para este mês.</h3>
                                 <p className="mt-2">Use o botão '+' para adicionar um abastecimento.</p>
                             </div>
                        ) : filteredEntries.map(entry => (
                            <div key={entry.id} className="bg-[var(--theme-card-bg)] p-4 rounded-xl flex items-center justify-between">
                                <div onClick={() => handleSelectEntry(entry)} className="flex items-center gap-4 cursor-pointer flex-grow">
                                    <div className="text-center w-16 p-2 rounded-lg bg-black/30">
                                        <p className="font-bold text-lg">{entry.date.getUTCDate()}</p>
                                        <p className="text-xs uppercase">{entry.date.toLocaleString('pt-BR', { month: 'short', timeZone: 'UTC' })}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">R$ {entry.totalValue.toFixed(2)}</p>
                                        <p className="text-sm text-gray-400">{entry.distance > 0 ? `${entry.distance.toFixed(0)} km` : 'Aguardando próximo'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                     <div className="text-right">
                                        <p className="font-semibold text-lg">{entry.avgKmpl > 0 ? `${entry.avgKmpl.toFixed(1)}` : '--'}<span className="text-xs text-gray-400"> km/L</span></p>
                                        <p className={`text-xs font-semibold px-2 py-0.5 rounded-full ${entry.fuelType === 'ETANOL' ? 'bg-green-800/50 text-green-300' : 'bg-red-800/50 text-red-300'}`}>{entry.fuelType}</p>
                                    </div>
                                    <button onClick={() => handleEditClick(entry)} className="p-2 text-gray-400 hover:text-white">
                                        <EditIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            
            <footer className="max-w-4xl mx-auto p-4 text-center text-gray-500 text-xs">
                <p>Desenvolvido por André Brito</p>
                <p>Versão 1.0</p>
            </footer>

            {activeModal === 'entry' && (
                <EntryModal
                    isOpen={activeModal === 'entry'}
                    onClose={handleCloseModal}
                    onSave={handleSaveEntry}
                    entryToEdit={entryToEdit}
                    lastKm={currentMileage}
                />
            )}
            {activeModal === 'trip' && (
                <TripModal
                    isOpen={activeModal === 'trip'}
                    onClose={handleCloseModal}
                    overallAvgKmpl={displayStats.averageKmpl}
                />
            )}
            {activeModal === 'maintenance' && (
                <MaintenanceModal
                    isOpen={activeModal === 'maintenance'}
                    onClose={handleCloseModal}
                    onSave={handleSaveMaintenance}
                    onDelete={handleDeleteMaintenance}
                    log={maintenanceLog}
                    currentMileage={currentMileage}
                />
            )}
            {selectedEntry && (
                <EntryDetailModal
                    isOpen={activeModal === 'detail'}
                    onClose={handleCloseModal}
                    entry={selectedEntry}
                    onDelete={handleDeleteEntry}
                    onEdit={handleEditClick}
                />
            )}
        </div>
    );
};

// Seed data function in case localStorage is empty
const getInitialSeedData = () => {
    const initialEntries: RawFuelEntry[] = [
        { id: '1', date: Timestamp.fromDate(new Date('2024-04-12T00:00:00Z')), totalValue: 100.00, pricePerLiter: 6.19, kmEnd: 134620, fuelType: 'GASOLINA' as any, notes: 'Posto Shell' },
        { id: '2', date: Timestamp.fromDate(new Date('2024-04-14T00:00:00Z')), totalValue: 100.00, pricePerLiter: 6.19, kmEnd: 134843, fuelType: 'GASOLINA' as any, notes: '' },
        { id: '3', date: Timestamp.fromDate(new Date('2024-04-16T00:00:00Z')), totalValue: 50.00, pricePerLiter: 5.89, kmEnd: 134932, fuelType: 'GASOLINA' as any, notes: '' },
        { id: '4', date: Timestamp.fromDate(new Date('2024-05-22T00:00:00Z')), totalValue: 50.00, pricePerLiter: 6.19, kmEnd: 135010, fuelType: 'GASOLINA' as any, notes: 'Viagem' },
        { id: '5', date: Timestamp.fromDate(new Date('2024-05-29T00:00:00Z')), totalValue: 273.82, pricePerLiter: 5.75, kmEnd: 135193, fuelType: 'GASOLINA' as any, notes: '' },
        { id: '6', date: Timestamp.fromDate(new Date('2024-06-05T00:00:00Z')), totalValue: 150.00, pricePerLiter: 5.85, kmEnd: 135500, fuelType: 'GASOLINA' as any, notes: '' }
    ];

    const initialMaintenance: MaintenanceEvent[] = [
        { id: 'm1', date: Timestamp.fromDate(new Date('2024-01-15T00:00:00Z')), serviceType: ServiceType.OIL_CHANGE, mileage: 130000, cost: 250, notes: 'Óleo 5W30 Sintético' },
        { id: 'm2', date: Timestamp.fromDate(new Date('2023-10-20T00:00:00Z')), serviceType: ServiceType.TIRE_CHANGE, mileage: 125000, cost: 1200, notes: '4 Pneus Michelin' },
    ];
    
    return { initialEntries, initialMaintenance };
};

export default App;
