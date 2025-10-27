
import React from 'react';
import type { ProcessedFuelEntry } from '../types.ts';
import { CloseIcon, EditIcon } from './Icons.tsx';

interface EntryDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry: ProcessedFuelEntry;
    onEdit: (entry: ProcessedFuelEntry) => void;
    onDelete: (id: string) => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({ isOpen, onClose, entry, onEdit, onDelete }) => {
    if (!isOpen) return null;

    const handleDelete = () => {
        if(window.confirm('Tem certeza que deseja excluir este registro?')) {
            onDelete(entry.id);
        }
    }

    return (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
             <div className="bg-[var(--theme-card-bg)] text-gray-200 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 modal-content">
                 <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold text-white">Detalhes do Registro</h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                 </div>
                 <div className="space-y-4">
                     <div className="bg-black/20 p-4 rounded-lg">
                         <p className="text-sm text-gray-400">Data do Abastecimento</p>
                         <p className="text-lg font-semibold">{entry.date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-black/20 p-4 rounded-lg">
                             <p className="text-sm text-gray-400">Valor Total</p>
                             <p className="text-lg font-semibold">R$ {entry.totalValue.toFixed(2)}</p>
                         </div>
                         <div className="bg-black/20 p-4 rounded-lg">
                             <p className="text-sm text-gray-400">Preço/Litro</p>
                             <p className="text-lg font-semibold">R$ {entry.pricePerLiter.toFixed(3)}</p>
                         </div>
                     </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-black/20 p-4 rounded-lg">
                             <p className="text-sm text-gray-400">Litros</p>
                             <p className="text-lg font-semibold">{entry.liters.toFixed(2)} L</p>
                         </div>
                          <div className="bg-black/20 p-4 rounded-lg">
                             <p className="text-sm text-gray-400">Combustível</p>
                             <p className="text-lg font-semibold capitalize">{entry.fuelType.toLowerCase()}</p>
                         </div>
                     </div>
                     <div className="bg-black/20 p-4 rounded-lg">
                         <p className="text-sm text-gray-400">Odômetro neste Abastecimento</p>
                         <p className="text-lg font-semibold">{entry.kmStart.toLocaleString('pt-BR')} km</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-black/20 p-4 rounded-lg">
                             <p className="text-sm text-gray-400">Distância Percorrida</p>
                             <p className="text-lg font-semibold">{entry.distance > 0 ? `${entry.distance.toFixed(0)} km` : 'Aguardando'}</p>
                         </div>
                         <div className="bg-black/20 p-4 rounded-lg">
                             <p className="text-sm text-gray-400">Média de Consumo</p>
                             <p className="text-lg font-semibold">{entry.avgKmpl > 0 ? `${entry.avgKmpl.toFixed(1)} km/L` : 'Aguardando'}</p>
                         </div>
                     </div>
                      {entry.notes && (
                         <div className="bg-black/20 p-4 rounded-lg">
                             <p className="text-sm text-gray-400">Anotações</p>
                             <p className="text-lg">{entry.notes}</p>
                         </div>
                     )}
                     <div className="flex justify-between items-center pt-4 gap-4">
                         <button onClick={() => onEdit(entry)} className="flex-1 flex items-center justify-center gap-2 border border-blue-500 text-blue-400 font-semibold py-2 px-4 rounded-lg hover:bg-blue-500/10 transition-colors">
                             <EditIcon size={18} /> Editar
                         </button>
                         <button onClick={handleDelete} className="flex-1 bg-red-800/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700/80 transition-colors">
                             Excluir
                         </button>
                     </div>
                 </div>
             </div>
         </div>
    );
};
