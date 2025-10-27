
import React from 'react';
import { FuelPumpIcon } from './Icons.tsx';

interface LoginScreenProps {
    onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-900 to-black text-white p-4 text-center animate-fade-in">
            <div className="mb-8 animate-slide-up-slow">
                <FuelPumpIcon size={80} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 animate-slide-up-slow" style={{ animationDelay: '100ms' }}>
                Meu Combustível
            </h1>
            <p className="text-lg text-gray-300 max-w-md mb-10 animate-slide-up-slow" style={{ animationDelay: '200ms' }}>
                Seu assistente inteligente para controle de gastos e manutenção veicular.
            </p>
            <button
                onClick={onLogin}
                className="w-full max-w-xs bg-white text-gray-900 font-bold py-4 px-6 rounded-xl shadow-2xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 animate-slide-up-slow"
                style={{ animationDelay: '300ms' }}
            >
                Entrar
            </button>
            <div className="absolute bottom-6 text-center text-gray-300 text-sm animate-slide-up-slow" style={{ animationDelay: '400ms' }}>
                <p>Desenvolvido por André Brito</p>
                <p>Versão 1.0</p>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }

                @keyframes slide-up-slow {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-up-slow {
                    animation: slide-up-slow 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};
