import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import type { MaintenanceEvent } from '../types.ts';
import { ServiceType } from '../types.ts';
import { CloseIcon, OilCanIcon, TireIcon, EngineIcon, WrenchIcon, EditIcon } from './Icons.tsx';

interface MaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<MaintenanceEvent, 'id'> & { id?: string }) => void;
    onDelete: (id: string) => void;
    log: MaintenanceEvent[];
    currentMileage: number;
}

const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const todayWithOffset = new Date(today.getTime() - (offset * 60 * 1000));
    return todayWithOffset.toISOString().split('T')[0];
};

const ServiceIcon = ({ type }: { type: ServiceType }) => {
    switch (type) {
        case ServiceType.OIL_CHANGE: return <OilCanIcon />;
        case ServiceType.TIRE_CHANGE: return <TireIcon />;
        case ServiceType.ENGINE_REVIEW: return <EngineIcon />;
        default: return <WrenchIcon />;
    }
};

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose, onSave, onDelete, log, currentMileage }) => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [eventToEdit, setEventToEdit] = useState<MaintenanceEvent | null>(null);
    const [formData, setFormData] = useState({
        date: getTodayString(),
        serviceType: ServiceType.OIL_CHANGE,
        mileage: '',
        cost: '',
        notes: ''
    });

    const sortedLog = [...log].sort((a, b) => b.date.toMillis() - a.date.toMillis());

    useEffect(() => {
        if (isOpen) {
            setView('list');
            setEventToEdit(null);
        }
    }, [isOpen]);

    useEffect(() => {
        if (eventToEdit) {
            const eventDate = eventToEdit.date.toDate();
            const offset = eventDate.getTimezoneOffset();
            const dateWithOffset = new Date(eventDate.getTime() - (offset * 60 * 1000));

            setFormData({
                date: dateWithOffset.toISOString().split('T')[0],
                serviceType: eventToEdit.serviceType,
                mileage: String(eventToEdit.mileage),
                cost: String(eventToEdit.cost),
                notes: eventToEdit.notes,
            });
            setView('form');
        } else {
            setFormData({
                date: getTodayString(),
                serviceType: ServiceType.OIL_CHANGE,
                mileage: currentMileage > 0 ? String(currentMileage) : '',
                cost: '',
                notes: ''
            });
        }
    }, [eventToEdit, currentMileage]);
    
    const handleAddNew = () => {
        setEventToEdit(null);
        setView('form');
    }

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este registro de manutenção?')) {
            onDelete(id);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const [year, month, day] = formData.date.split('-').map(Number);
        const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        
        const eventData = {
            id: eventToEdit?.id,
            date: Timestamp.fromDate(utcDate),
            serviceType: formData.serviceType,
            mileage: parseInt(formData.mileage) || 0,
            cost: parseFloat(formData.cost) || 0,
            notes: formData.notes,
        };
        onSave(eventData);
        setView('list');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-[var(--theme-card-bg)] text-gray-200 rounded-xl shadow-2xl p-6 w-full max-w-2xl m-4 modal-content overflow-y-auto max-h-[95vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {view === 'list' ? 'Histórico de Manutenção' : eventToEdit ? 'Editar Registro' : 'Adicionar Registro'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                </div>

                {view === 'list' ? (
                    <div className="space-y-4">
                         <div className="flex justify-end">
                             <button onClick={handleAddNew} className="bg-gradient-to-br from-[var(--theme-gradient-start)] to-[var(--theme-gradient-end)] text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-colors">
                                Adicionar Novo
                            </button>
                        </div>
                        {sortedLog.length === 0 ? (
                            <p className="text-center text-gray-400 py-8">Nenhum registro de manutenção encontrado.</p>
                        ) : (
                            <div className="space-y-3">
                                {sortedLog.map(event => (
                                    <div key={event.id} className="bg-black/30 p-4 rounded-lg flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-gray-800 rounded-full"><ServiceIcon type={event.serviceType} /></div>
                                            <div>
                                                <p className="font-bold text-white">{event.serviceType}</p>
                                                <p className="text-sm text-gray-400">{event.date.toDate().toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                                                <p className="text-sm text-gray-400">{event.mileage.toLocaleString('pt-BR')} km</p>
                                                {event.notes && <p className="text-sm text-gray-300 mt-1 italic">"{event.notes}"</p>}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-lg text-white">R$ {event.cost.toFixed(2)}</p>
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => setEventToEdit(event)} className="text-gray-400 hover:text-white"><EditIcon size={18} /></button>
                                                <button onClick={() => handleDelete(event.id)} className="text-gray-400 hover:text-red-400">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-300">Data</label>
                                <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]"/>
                            </div>
                            <div>
                               <label className="block text-sm font-medium text-gray-300">Tipo de Serviço</label>
                               <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]">
                                    {Object.values(ServiceType).map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="mileage" className="block text-sm font-medium text-gray-300">Odômetro (km)</label>
                                <input type="number" name="mileage" id="mileage" value={formData.mileage} onChange={handleChange} placeholder="135000" required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]"/>
                            </div>
                            <div>
                                <label htmlFor="cost" className="block text-sm font-medium text-gray-300">Custo (R$)</label>
                                <input type="number" step="0.01" name="cost" id="cost" value={formData.cost} onChange={handleChange} placeholder="350.00" required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Anotações</label>
                            <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Ex: Troca de filtro de ar e óleo" className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]"></textarea>
                        </div>
                        <div className="flex justify-end pt-4 gap-4">
                            <button type="button" onClick={() => setView('list')} className="text-gray-300 font-semibold py-2 px-5 rounded-lg hover:bg-gray-700/50">Cancelar</button>
                            <button type="submit" className="bg-gradient-to-br from-[var(--theme-gradient-start)] to-[var(--theme-gradient-end)] text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-colors">
                                {eventToEdit ? 'Salvar Alterações' : 'Salvar Registro'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
