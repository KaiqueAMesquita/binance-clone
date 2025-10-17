'use client';

// TradeConverter.jsx
// Clone simplificado da tela de Conversão (Instantânea) da Binance
// - Mobile-first com TailwindCSS
// - Simula conversão BTC → SOL
// - Pré-visualização abre um bottom-sheet com confirmação (6s) e toast

import { useEffect, useMemo, useState } from 'react';
import { SiBitcoin, SiSolana } from 'react-icons/si';
import { BiTransfer } from 'react-icons/bi';
import { FiChevronDown, FiArrowLeft, FiSettings, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { currencyAPI } from '@/services/CurrencyService';

// Formatadores numéricos
const nf8 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 8, maximumFractionDigits: 8 });
const nf6 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 6 });
const nf2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TradeConverter() {
  // Taxas conforme especificação: 1 SOL = 0.00171586 BTC → 1 BTC = 582.798 SOL
  const btcPerSol = 0.00171586;
  const solPerBtc = useMemo(() => 1 / btcPerSol, [btcPerSol]);

  // Estado de moedas
  const [fromSymbol, setFromSymbol] = useState('BTC');
  const [toSymbol, setToSymbol] = useState('SOL');
  const [currencies, setCurrencies] = useState([]);
  const [openMenu, setOpenMenu] = useState(null); // 'from' | 'to' | null

  // Busca moedas da currency API
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await currencyAPI.getAll();
        if (!active) return;
        // Deduplica por símbolo e ordena colocando BTC e SOL primeiro
        const uniq = [];
        const seen = new Set();
        for (const c of list) {
          const sym = (c.symbol || '').toUpperCase();
          if (!sym || seen.has(sym)) continue;
          seen.add(sym);
          uniq.push({ symbol: sym, name: c.name || sym });
        }
        uniq.sort((a, b) => {
          const prio = (s) => (s === 'BTC' ? 0 : s === 'SOL' ? 1 : 2);
          const d = prio(a.symbol) - prio(b.symbol);
          return d !== 0 ? d : a.symbol.localeCompare(b.symbol);
        });
        setCurrencies(uniq);
      } catch (err) {
        // mantém fallback silencioso
        console.error('Falha ao carregar moedas', err);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Disponível mockado (para exibir no topo direito e botão Máx.)
  const available = 0.00063336; // BTC

  // USD para estimar “≈ $ 66,56”
  const usdPerSol = 180.4; // 0.36912091 * 180.4 ≈ 66.56

  // Valor inicial: 0.00063336 BTC → 0.36912091 SOL
  const [fromAmount, setFromAmount] = useState(0.00063336);

  // Valor de destino (derivado)
  const toAmount = useMemo(() => {
    if (fromSymbol === 'BTC' && toSymbol === 'SOL') return fromAmount * solPerBtc;
    if (fromSymbol === 'SOL' && toSymbol === 'BTC') return fromAmount * btcPerSol;
    return 0;
  }, [fromAmount, fromSymbol, toSymbol, solPerBtc]);

  // Aproximação em USD
  const approxUsd = useMemo(() => {
    const sol = fromSymbol === 'BTC' ? toAmount : fromAmount;
    return nf2.format(sol * usdPerSol);
  }, [fromSymbol, fromAmount, toAmount]);

  // Regras de habilitação (thresholds visuais do app original)
  const minFrom = fromSymbol === 'BTC' ? 0.0000001 : 0.000055; // valores apenas para a UI
  const valid = fromAmount >= minFrom;

  // Pré-visualização e confirmação
  const [confirming, setConfirming] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    if (countdown === 0) {
      setConfirming(false);
      setCountdown(6);
      setShowSheet(false);
      toast.success('Conversão concluída com sucesso!');
      return;
    }
    const t = setTimeout(() => setCountdown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [confirming, countdown]);

  // Inverter direção
  const handleInvert = () => {
    setFromSymbol((prev) => (prev === 'BTC' ? 'SOL' : 'BTC'));
    setToSymbol((prev) => (prev === 'SOL' ? 'BTC' : 'SOL'));
    // Ajusta o valor de entrada para manter equivalência perceptível
    if (fromSymbol === 'BTC') {
      const solAmount = fromAmount * solPerBtc;
      setFromAmount(parseFloat(solAmount.toFixed(8)));
    } else {
      const btcAmount = fromAmount * btcPerSol;
      setFromAmount(parseFloat(btcAmount.toFixed(8)));
    }
  };

  // Ícone do ativo (JS puro — sem tipos TS)
  const AssetIcon = ({ sym }) => {
    const s = (sym || '').toUpperCase();
    if (s === 'BTC') {
      return (
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white">
          <SiBitcoin className="text-[14px]" />
        </div>
      );
    }
    if (s === 'SOL') {
      return (
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
          <SiSolana className="text-[14px]" />
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-500 to-slate-700 text-white text-[10px] font-semibold">
        {s?.slice(0, 3)}
      </div>
    );
  };

  // Campo controlado (permite vírgula)
  const handleChange = (v) => {
    const n = Number(String(v).replace(',', '.'));
    if (Number.isFinite(n) && n >= 0) setFromAmount(n);
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] text-gray-100 pb-28">
      {/* Header */}
      <header className="max-w-xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between text-gray-300">
        <button className="p-2 -ml-2 rounded-md hover:bg-white/5" aria-label="Voltar">
          <FiArrowLeft />
        </button>
        <h1 className="text-xl font-semibold text-gray-200">Converter</h1>
        <button className="p-2 -mr-2 rounded-md hover:bg-white/5" aria-label="Configurações">
          <FiSettings />
        </button>
      </header>

      {/* Abas */}
      <div className="max-w-xl mx-auto px-4">
        <div className="inline-grid grid-cols-3 gap-2 bg-[#151A1F] rounded-lg p-1 border border-[#1f242c]">
          {['Instantânea', 'Recorrente', 'Limite'].map((t, i) => (
            <button
              key={t}
              className={`py-2 px-4 text-sm rounded-md transition-colors ${
                i === 0 ? 'bg-[#1E2329] text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cartão principal */}
      <main className="max-w-xl mx-auto mt-4 px-4">
        <div className="bg-[#151A1F] border border-[#1f242c] rounded-2xl p-4 sm:p-5">
          {/* Linha de rótulos e disponível */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>De</span>
            <div>
              Disponível {nf8.format(available)} {fromSymbol}{' '}
              <button
                className="text-yellow-400 hover:text-yellow-300 ml-1"
                onClick={() => setFromAmount(available)}
              >
                Máx.
              </button>
            </div>
          </div>

          {/* Linha de entrada */}
          <div className="mt-2 flex items-center gap-3">
            <button onClick={() => setOpenMenu(openMenu === 'from' ? null : 'from')} className="relative flex items-center gap-2 bg-[#1E2329] border border-[#2b3139] rounded-xl px-3 py-2">
              <AssetIcon sym={fromSymbol} />
              <span className="text-sm font-medium">{fromSymbol}</span>
              <FiChevronDown className="text-gray-400" />
              {openMenu === 'from' && (
                <div className="absolute left-0 top-full mt-2 z-50 w-56 max-h-80 overflow-y-auto overscroll-contain rounded-xl border border-[#2b3139] bg-[#0F1318] shadow-lg">
                  {currencies.length === 0 && (
                    <div className="px-3 py-2 text-xs text-gray-500">Carregando…</div>
                  )}
                  {currencies.map((c) => (
                    <button
                      key={`from-${c.symbol}`}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 text-sm text-gray-200"
                      onClick={() => {
                        setFromSymbol(c.symbol);
                        setOpenMenu(null);
                        if (c.symbol === toSymbol) setToSymbol(fromSymbol);
                      }}
                    >
                      <AssetIcon sym={c.symbol} />
                      <span className="font-medium">{c.symbol}</span>
                      <span className="ml-auto text-xs text-gray-500">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <input
                inputMode="decimal"
                className="w-full bg-transparent text-right text-xl sm:text-2xl font-semibold placeholder-gray-600 focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
                value={fromAmount}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="> 0.0000001"
              />
            </div>
          </div>

          {/* Separador com botão de inversão */}
          <div className="relative my-5">
            <div className="h-px w-full bg-[#1f242c]" />
            <button
              onClick={handleInvert}
              className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#1E2329] border border-[#2b3139] rounded-xl p-2 text-gray-300 hover:text-yellow-400"
              aria-label="Inverter"
            >
              <BiTransfer />
            </button>
          </div>

          {/* Para */}
          <div className="text-xs text-gray-400">Para</div>
          <div className="mt-2 flex items-center gap-3">
            <button onClick={() => setOpenMenu(openMenu === 'to' ? null : 'to')} className="relative flex items-center gap-2 bg-[#1E2329] border border-[#2b3139] rounded-xl px-3 py-2">
              <AssetIcon sym={toSymbol} />
              <span className="text-sm font-medium">{toSymbol}</span>
              <FiChevronDown className="text-gray-400" />
              {openMenu === 'to' && (
                <div className="absolute left-0 top-full mt-2 z-50 w-56 max-h-80 overflow-y-auto overscroll-contain rounded-xl border border-[#2b3139] bg-[#0F1318] shadow-lg">
                  {currencies.length === 0 && (
                    <div className="px-3 py-2 text-xs text-gray-500">Carregando…</div>
                  )}
                  {currencies.map((c) => (
                    <button
                      key={`to-${c.symbol}`}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 text-sm text-gray-200"
                      onClick={() => {
                        setToSymbol(c.symbol);
                        setOpenMenu(null);
                        if (c.symbol === fromSymbol) setFromSymbol(toSymbol);
                      }}
                    >
                      <AssetIcon sym={c.symbol} />
                      <span className="font-medium">{c.symbol}</span>
                      <span className="ml-auto text-xs text-gray-500">{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </button>
            <div className="flex-1 min-w-0 text-right text-xl sm:text-2xl font-semibold text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
              {valid ? nf8.format(toAmount) : '> 0.000055'}
            </div>
          </div>

          {/* Taxa textual */}
          <p className="text-[10px] sm:text-xs text-gray-500 mt-3">
            {fromSymbol === 'BTC' && toSymbol === 'SOL' && (
              <>1 SOL = {nf8.format(btcPerSol)} BTC</>
            )}
            {fromSymbol === 'SOL' && toSymbol === 'BTC' && (
              <>1 BTC = {nf6.format(solPerBtc)} SOL</>
            )}
            {!(
              (fromSymbol === 'BTC' && toSymbol === 'SOL') ||
              (fromSymbol === 'SOL' && toSymbol === 'BTC')
            ) && <>--</>}
          </p>
        </div>

        {/* Botão de Pré-visualização */}
        <div className="mt-5">
          <button
            disabled={!valid}
            onClick={() => setShowSheet(true)}
            className={`w-full py-3.5 rounded-2xl font-medium transition-all ${
              valid ? 'bg-[#F0B90B] text-[#0B0E11] hover:bg-[#FCD535] active:scale-[.99]' : 'bg-yellow-900/30 text-yellow-900 cursor-not-allowed'
            }`}
          >
            Pré-visualização
          </button>
        </div>
      </main>

      {/* Bottom Sheet de confirmação */}
      {showSheet && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => (!confirming ? setShowSheet(false) : null)}
          />
          <div className="absolute left-0 right-0 bottom-0 bg-[#1A1F25] border-t border-[#1f242c] rounded-t-[26px] p-4 sm:p-6">
            <div className="max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Confirmar ordem</h2>
                <button
                  className="p-2 rounded-md hover:bg-white/5"
                  onClick={() => (!confirming ? setShowSheet(false) : null)}
                  aria-label="Fechar"
                >
                  <FiX />
                </button>
              </div>

              {/* Linhas de resumo */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AssetIcon sym={fromSymbol} />
                    <span className="font-medium">{fromSymbol}</span>
                  </div>
                  <div className="text-right font-semibold">{nf8.format(fromAmount)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AssetIcon sym={toSymbol} />
                    <span className="font-medium">{toSymbol}</span>
                  </div>
                  <div className="text-right font-semibold">
                    {nf8.format(toAmount)}
                    <span className="block text-[11px] text-gray-400">≈ $ {approxUsd}</span>
                  </div>
                </div>
                <hr className="border-[#1f242c]" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2 text-gray-400">
                    <span>Tipo</span>
                    <span className="text-gray-200">Instantânea</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2 text-gray-400">
                    <span>Taxas de transação</span>
                    <span className="text-gray-200">0 {toSymbol}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2 text-gray-400">
                    <span>Taxa</span>
                    <span className="text-gray-200">1 BTC = {nf6.format(solPerBtc)} SOL</span>
                  </div>
                </div>
              </div>

              {/* Botão Confirmar */}
              <div className="mt-5">
                <button
                  disabled={confirming}
                  onClick={() => setConfirming(true)}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-[#0B0E11] transition-all shadow-lg ${
                    confirming ? 'bg-yellow-300 cursor-not-allowed' : 'bg-[#F0B90B] hover:bg-[#FCD535] active:scale-[.99]'
                  }`}
                >
                  {confirming ? `Confirmando (${countdown}s)` : 'Confirmar (6s)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
