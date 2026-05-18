"use client";

import { useEffect, useRef, useState } from "react";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Volume1,
    ListMusic,
    RotateCcw,
    RotateCw,
} from "lucide-react";

import musicPlaylist from "./data/music_playlist";

export default function PaginaAudio() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [audioIndex, setAudioIndex] = useState(0);
    const [tocando, setTocando] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);

    const musicaAtual = musicPlaylist[audioIndex];

    const velocidades = [0.75, 1, 1.25, 1.5, 2];

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.load();
        setCurrentTime(0);
        setDuration(0);
        if (tocando) audio.play().catch(() => {});
    }, [audioIndex]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.playbackRate = playbackRate;
    }, [playbackRate]);

    const alternarAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (tocando) {
            audio.pause();
            setTocando(false);
        } else {
            audio.play();
            setTocando(true);
        }
    };

    const musicaAnterior = () =>
        setAudioIndex((i) => (i === 0 ? musicPlaylist.length - 1 : i - 1));

    const proximaMusica = () =>
        setAudioIndex((i) => (i === musicPlaylist.length - 1 ? 0 : i + 1));

    const tocarMusicaEspecifica = (index: number) => {
        setAudioIndex(index);
        setTocando(true);
    };

    const configurarTempo = (time: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = time;
        setCurrentTime(time);
    };

    const voltar10s = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Math.max(0, audio.currentTime - 10);
        setCurrentTime(audio.currentTime);
    };

    const avancar10s = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Math.min(duration, audio.currentTime + 10);
        setCurrentTime(audio.currentTime);
    };

    const formatarTempo = (tempo: number) => {
        if (isNaN(tempo)) return "0:00";
        const m = Math.floor(tempo / 60);
        const s = Math.floor(tempo % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const progresso = duration > 0 ? (currentTime / duration) * 100 : 0;

    const VolumeIcon =
        volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 p-6 text-zinc-900 sm:p-10">

            {/* Fundo blur */}
            <div
                className="absolute inset-0 z-0 scale-110 bg-cover bg-center opacity-25 blur-[120px]"
                style={{ backgroundImage: `url(${musicaAtual.imagem})` }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

            {/* Container principal */}
            <div className="relative z-10 flex w-full max-w-5xl flex-col gap-0 rounded-3xl bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl ring-1 ring-white/10 lg:flex-row">

                {/* ─── PLAYER ─────────────────────────────────── */}
                <div className="flex w-full flex-col items-center p-8 lg:w-[55%] lg:p-10">

                    {/* CAPA */}
                    <div className="relative mb-8 aspect-square w-full max-w-[300px]">
                        <img
                            src={musicaAtual.imagem}
                            alt={musicaAtual.nome}
                            className="h-full w-full rounded-2xl object-cover shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                        />
                        {tocando && (
                            <div className="absolute bottom-3 right-3 flex gap-[3px] rounded-full bg-white/70 px-2 py-1.5 backdrop-blur-sm">
                                {[0, 75, 150].map((d) => (
                                    <span
                                        key={d}
                                        className="h-3 w-1 animate-bounce rounded-full bg-green-400"
                                        style={{ animationDelay: `${d}ms` }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <audio
                        ref={audioRef}
                        src={musicaAtual.url}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                        onEnded={proximaMusica}
                    />

                    <div className="w-full max-w-[360px]">

                        {/* TÍTULO + ARTISTA */}
                        <div className="mb-6 text-center">
                            <h2 className="line-clamp-1 text-2xl font-extrabold tracking-tight text-zinc-100">
                                {musicaAtual.nome}
                            </h2>
                            <p className="mt-1 text-sm font-medium text-zinc-400">
                                {musicaAtual.artista}
                            </p>
                        </div>

                        {/* BARRA DE PROGRESSO */}
                        <div className="mb-5 w-full">
                            <div className="relative h-1.5 w-full cursor-pointer rounded-full bg-zinc-700">
                                {/* preenchimento verde */}
                                <div
                                    className="absolute left-0 top-0 h-full rounded-full bg-green-500 transition-all"
                                    style={{ width: `${progresso}%` }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 0}
                                    step={0.01}
                                    value={currentTime}
                                    onChange={(e) => configurarTempo(Number(e.target.value))}
                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                />
                            </div>
                            <div className="mt-2 flex justify-between text-[11px] font-semibold tabular-nums text-zinc-500">
                                <span>{formatarTempo(currentTime)}</span>
                                <span>{formatarTempo(duration)}</span>
                            </div>
                        </div>

                        {/* ── CONTROLES PRINCIPAIS ── */}
                        <div className="mb-6 flex items-center justify-between">

                            {/* Voltar música */}
                            <button
                                onClick={musicaAnterior}
                                title="Música anterior"
                                className="flex flex-col items-center gap-1 text-zinc-500 transition hover:text-zinc-100"
                            >
                                <SkipBack size={22} />
                            </button>

                            {/* Voltar 10s */}
                            <button
                                onClick={voltar10s}
                                title="Voltar 10 segundos"
                                className="flex flex-col items-center gap-1 text-zinc-400 transition hover:text-zinc-100"
                            >
                                <RotateCcw size={20} />
                                <span className="text-[10px] font-bold leading-none text-zinc-500">
                                    10s
                                </span>
                            </button>

                            {/* Play / Pause */}
                            <button
                                onClick={alternarAudio}
                                className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-zinc-900 shadow-[0_0_30px_rgba(255,255,255,0.15)] transition hover:scale-105 hover:bg-green-400 active:scale-95"
                            >
                                {tocando ? (
                                    <Pause size={28} />
                                ) : (
                                    <Play size={28} className="ml-1" />
                                )}
                            </button>

                            {/* Avançar 10s */}
                            <button
                                onClick={avancar10s}
                                title="Avançar 10 segundos"
                                className="flex flex-col items-center gap-1 text-zinc-400 transition hover:text-zinc-100"
                            >
                                <RotateCw size={20} />
                                <span className="text-[10px] font-bold leading-none text-zinc-500">
                                    10s
                                </span>
                            </button>

                            {/* Próxima música */}
                            <button
                                onClick={proximaMusica}
                                title="Próxima música"
                                className="flex flex-col items-center gap-1 text-zinc-500 transition hover:text-zinc-100"
                            >
                                <SkipForward size={22} />
                            </button>
                        </div>

                        {/* ── VOLUME ── */}
                        <div className="mb-5 flex items-center gap-3">
                            <button
                                onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                                className="text-zinc-400 transition hover:text-zinc-100"
                                title={volume === 0 ? "Ativar som" : "Silenciar"}
                            >
                                <VolumeIcon size={18} />
                            </button>
                            <div className="relative flex-1 h-1.5 rounded-full bg-zinc-700">
                                <div
                                    className="absolute left-0 top-0 h-full rounded-full bg-zinc-400 transition-all"
                                    style={{ width: `${volume * 100}%` }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={volume}
                                    onChange={(e) => setVolume(Number(e.target.value))}
                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                />
                            </div>
                            <span className="w-8 text-right text-[11px] font-semibold text-zinc-500">
                                {Math.round(volume * 100)}%
                            </span>
                        </div>

                        {/* ── VELOCIDADE ── */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-500 shrink-0">
                                Velocidade
                            </span>
                            <div className="flex flex-1 items-center gap-1.5 rounded-full bg-zinc-800 p-1">
                                {velocidades.map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setPlaybackRate(v)}
                                        className={`flex-1 rounded-full py-1 text-[11px] font-bold transition ${
                                            playbackRate === v
                                                ? "bg-white text-zinc-900 shadow"
                                                : "text-zinc-400 hover:text-zinc-100"
                                        }`}
                                    >
                                        {v === 1 ? "1x" : `${v}x`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── DIVISOR ─────────────────────────────────── */}
                <div className="mx-8 h-px bg-white/10 lg:mx-0 lg:h-auto lg:w-px" />

                {/* ─── PLAYLIST ────────────────────────────────── */}
                <div className="flex w-full flex-col p-8 lg:w-[45%] lg:p-10">

                    {/* Cabeçalho */}
                    <div className="mb-6 flex items-center gap-3">
                            <ListMusic size={20} className="text-green-500" />
                            <h3 className="text-base font-bold tracking-tight text-zinc-300">
                            Fila de Reprodução
                        </h3>
                            <span className="ml-auto rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-bold text-zinc-400">
                            {musicPlaylist.length}
                        </span>
                    </div>

                    {/* Lista */}
                    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[440px] pr-1">
                        {musicPlaylist.map((musica, index) => {
                            const isAtiva = index === audioIndex;
                            return (
                                <button
                                    key={index}
                                    onClick={() => tocarMusicaEspecifica(index)}
                                    className={`group flex items-center gap-4 rounded-xl p-3 text-left transition-all ${
                                        isAtiva
                                            ? "bg-white/10 ring-1 ring-white/10"
                                            : "hover:bg-white/5"
                                    }`}
                                >
                                    {/* Capa mini */}
                                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg shadow-md">
                                        <img
                                            src={musica.imagem}
                                            alt={musica.nome}
                                            className="h-full w-full object-cover"
                                        />
                                        {isAtiva && tocando && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <div className="flex items-end gap-[2px]">
                                                    {[0, 75, 150].map((d) => (
                                                        <span
                                                            key={d}
                                                            className="w-1 animate-bounce rounded-full bg-green-400"
                                                            style={{
                                                                height: "12px",
                                                                animationDelay: `${d}ms`,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Número da faixa */}
                                    <span
                                        className={`w-5 shrink-0 text-center text-xs font-bold ${
                                            isAtiva ? "text-green-500" : "text-zinc-500 group-hover:text-zinc-300"
                                        }`}
                                    >
                                        {isAtiva ? "♫" : index + 1}
                                    </span>

                                    {/* Info */}
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span
                                            className={`line-clamp-1 text-sm font-semibold ${
                                                isAtiva ? "text-green-400" : "text-zinc-200 group-hover:text-zinc-100"
                                            }`}
                                        >
                                            {musica.nome}
                                        </span>
                                        <span className="line-clamp-1 text-xs text-zinc-500">
                                            {musica.artista}
                                        </span>
                                    </div>

                                    {/* Duração placeholder */}
                                    {isAtiva && (
                                        <span className="shrink-0 text-[11px] font-semibold tabular-nums text-zinc-500">
                                            {formatarTempo(currentTime)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}