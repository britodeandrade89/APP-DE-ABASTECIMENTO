
import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icons.tsx';
import type { RawFuelEntry, FuelType } from '../types.ts';
import { Timestamp } from 'firebase/firestore';

interface EntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (entry: Omit<RawFuelEntry, 'id'> & { id?: string }) => void;
    entryToEdit: RawFuelEntry | null;
    lastKm: number;
}

const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const todayWithOffset = new Date(today.getTime() - (offset*60*1000));
    return todayWithOffset.toISOString().split('T')[0];
}

export const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, onSave, entryToEdit, lastKm }) => {
    const [formData, setFormData] = useState({
        date: getTodayString(),
        totalValue: '',
        pricePerLiter: '',
        kmEnd: '',
        fuelType: 'GASOLINA' as FuelType,
        notes: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (entryToEdit) {
                const entryDate = entryToEdit.date.toDate();
                const offset = entryDate.getTimezoneOffset();
                const dateWithOffset = new Date(entryDate.getTime() - (offset*60*1000));

                setFormData({
                    date: dateWithOffset.toISOString().split('T')[0],
                    totalValue: String(entryToEdit.totalValue),
                    pricePerLiter: String(entryToEdit.pricePerLiter),
                    kmEnd: String(entryToEdit.kmEnd),
                    fuelType: entryToEdit.fuelType,
                    notes: entryToEdit.notes,
                });
            } else {
                 setFormData({
                    date: getTodayString(),
                    totalValue: '',
                    pricePerLiter: '',
                    kmEnd: lastKm > 0 ? '' : '',
                    fuelType: 'GASOLINA' as FuelType,
                    notes: '',
                });
            }
        }
    }, [entryToEdit, isOpen, lastKm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const [year, month, day] = formData.date.split('-').map(Number);
        // Corrige a data para ser UTC
        const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        
        const entryData = {
            id: entryToEdit?.id,
            date: Timestamp.fromDate(utcDate),
            totalValue: parseFloat(formData.totalValue) || 0,
            pricePerLiter: parseFloat(formData.pricePerLiter) || 0,
            kmEnd: parseInt(formData.kmEnd) || 0,
            fuelType: formData.fuelType,
            notes: formData.notes,
        };
        onSave(entryData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-[var(--theme-card-bg)] text-gray-200 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 modal-content">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{entryToEdit ? 'Editar' : 'Adicionar'} Abastecimento</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300">Data</label>
                        <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="totalValue" className="block text-sm font-medium text-gray-300">Valor Total (R$)</label>
                            <input type="number" step="0.01" name="totalValue" id="totalValue" value={formData.totalValue} onChange={handleChange} placeholder="150.00" required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]"/>
                        </div>
                        <div>
                            <label htmlFor="pricePerLiter" className="block text-sm font-medium text-gray-300">Preço/Litro (R$)</label>
                            <input type="number" step="0.001" name="pricePerLiter" id="pricePerLiter" value={formData.pricePerLiter} onChange={handleChange} placeholder="5.80" required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="kmEnd" className="block text-sm font-medium text-gray-300">Odômetro (km)</label>
                        <input type="number" name="kmEnd" id="kmEnd" value={formData.kmEnd} onChange={handleChange} placeholder={lastKm > 0 ? `Ex: ${lastKm + 350}` : '123456'} required className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Tipo de Combustível</label>
                        <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]">
                            <option value="GASOLINA">Gasolina</option>
                            <option value="ETANOL">Etanol</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Anotações</label>
                        <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="Ex: Posto Ipiranga" className="mt-1 block w-full bg-black/20 border-white/10 text-white rounded-md shadow-sm focus:ring-[var(--theme-accent)] focus:border-[var(--theme-accent)]"></textarea>
                    </div>
                    <div className="flex justify-end pt-2">
                         <button type="submit" className="w-full bg-gradient-to-br from-[var(--theme-gradient-start)] to-[var(--theme-gradient-end)] text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:opacity-90 transition-all">
                            {entryToEdit ? 'Salvar Alterações' : 'Adicionar Registro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
