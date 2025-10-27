import { Timestamp } from 'firebase/firestore';

export enum FuelType {
    ETHANOL = 'ETANOL',
    GASOLINE = 'GASOLINA',
}

export interface RawFuelEntry {
    id: string;
    date: Timestamp;
    totalValue: number;
    pricePerLiter: number;
    kmEnd: number;
    fuelType: FuelType;
    notes: string;
}

export interface ProcessedFuelEntry extends RawFuelEntry {
    date: Date;
    liters: number;
    kmStart: number;
    distance: number;
    avgKmpl: number;
}

export enum ServiceType {
    OIL_CHANGE = 'Troca de Óleo',
    TIRE_CHANGE = 'Troca de Pneus',
    ENGINE_REVIEW = 'Revisão do Motor',
    GENERAL = 'Revisão Geral',
    OTHER = 'Outro',
}

export interface MaintenanceEvent {
    id: string;
    date: Timestamp;
    serviceType: ServiceType;
    mileage: number;
    cost: number;
    notes: string;
}
