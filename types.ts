
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

export interface MaintenanceData {
    oil: number;
    tires: number;
    engine: number;
}
