import React from 'react';

const Loading = ({ fullScreen = false, text = "در حال بارگذاری...", size = "w-16 h-16" }) => {
    const containerClass = fullScreen
        ? "fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm"
        : "w-full py-12 flex items-center justify-center";

    return (
        <div className={`${containerClass} flex flex-col items-center justify-center`}>
            <div className="relative">
                {/* Outer rotating ring */}
                <div className={`${size} rounded-full border-[3px] border-gold-100 dark:border-slate-800`}></div>
                <div className={`absolute inset-0 ${size} rounded-full border-[3px] border-transparent border-t-gold-500 border-r-gold-400 animate-spin shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)]`}></div>

                {/* Inner static/pulsing gem */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gold-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
                </div>
            </div>

            {/* Loading Text */}
            {text && (
                <h3 className="mt-4 text-gold-600 dark:text-gold-400 font-medium text-sm tracking-widest animate-pulse">
                    {text}
                </h3>
            )}
        </div>
    );
};

export default Loading;
