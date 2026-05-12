"use client";

import { useRef, useState } from "react";

export default function PaginaAudio() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [tocando, setTocando] = useState(false);
    const [volume, setVolume] = useState(1);

    // Play e Pause
    const alternarAudio = () => {
        if (!audioRef.current) return;

        if (tocando) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }

        setTocando(!tocando);
    };

    // Controle de volume
    const alterarVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const novoVolume = Number(e.target.value);

        setVolume(novoVolume);

        if (audioRef.current) {
            audioRef.current.volume = novoVolume;
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-80 flex flex-col items-center">
                
                {/* Capa */}
                <img
                    src="https://http2.mlstatic.com/D_NQ_NP_753001-MLB30579306313_052019-O.webp"
                    alt="Capa da música"
                    className="w-56 h-56 rounded-xl object-cover mb-6"
                />

                {/* Áudio */}
                <audio ref={audioRef} src="/music.mp3" />

                {/* Botão */}
                <button
                    onClick={alternarAudio}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg mb-5 transition"
                >
                    {tocando ? "Pausar" : "Tocar"}
                </button>

                {/* Volume */}
                <div className="w-full flex flex-col items-center">
                    <label className="text-gray-300 mb-2">
                        Volume
                    </label>

                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={alterarVolume}
                        className="w-full"
                    />
                </div>
            </div>
        </main>
    );
}