'use client';

import { useEffect, useMemo, useState } from 'react';
import { SiBitcoin, SiEthereum, SiSolana } from 'react-icons/si';
import { BiTransfer } from 'react-icons/bi';
import { FiChevronDown, FiArrowLeft, FiSettings, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { currencyAPI, Currency as CurrencyFromAPI } from '@/services/CurrencyService';
import styles from './TradeConverter.module.css';

// --- DEFINIÇÃO DE TIPOS E INTERFACES ---
interface ProcessedCurrency {
  symbol: string;
  name: string;
  latestPrice: number;
}

interface AssetIconProps {
  sym: string;
}

// --- FORMATADORES NUMÉRICOS ---
const nf8 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 8, maximumFractionDigits: 8 });
const nf6 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 6 });
const nf2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// --- COMPONENTE PRINCIPAL ---
export default function TradeConverter() {
  // --- ESTADOS FORTEMENTE TIPADOS ---
  const [currencyData, setCurrencyData] = useState<ProcessedCurrency[]>([]);
  const [fromSymbol, setFromSymbol] = useState<string>('BTC');
  const [toSymbol, setToSymbol] = useState<string>('ETH');
  const [openMenu, setOpenMenu] = useState<'from' | 'to' | null>(null);
  const [fromAmount, setFromAmount] = useState<number>(0.00063336);
  const [confirming, setConfirming] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(6);
  const [showSheet, setShowSheet] = useState<boolean>(false);

  // Busca e processa os dados da API
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list: CurrencyFromAPI[] = await currencyAPI.getAll();
        if (!active) return;

        const processedList: ProcessedCurrency[] = list
          .map((c) => {
            if (!c.symbol || !c.histories || c.histories.length === 0) return null;
            const latestHistory = [...c.histories].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())[0];
            return {
              symbol: c.symbol.toUpperCase(),
              name: c.name || c.symbol,
              latestPrice: latestHistory.price,
            };
          })
          .filter((c): c is ProcessedCurrency => c !== null);

        processedList.sort((a, b) => {
          const prio = (s: string) => (s === 'BTC' ? 0 : s === 'ETH' ? 1 : 2);
          const d = prio(a.symbol) - prio(b.symbol);
          return d !== 0 ? d : a.symbol.localeCompare(b.symbol);
        });
        setCurrencyData(processedList);
      } catch (err: unknown) {
        console.error('Falha ao carregar moedas', err);
        toast.error('Não foi possível carregar os dados das moedas.');
      }
    })();
    return () => { active = false; };
  }, []);

  // --- VALORES DERIVADOS COM useMemo ---
  const fromCurrency = useMemo(() => currencyData.find(c => c.symbol === fromSymbol), [currencyData, fromSymbol]);
  const toCurrency = useMemo(() => currencyData.find(c => c.symbol === toSymbol), [currencyData, toSymbol]);

  const toAmount = useMemo<number>(() => {
    if (!fromCurrency || !toCurrency) return 0;
    const rate = fromCurrency.latestPrice / toCurrency.latestPrice;
    return fromAmount * rate;
  }, [fromAmount, fromCurrency, toCurrency]);

  const exchangeRate = useMemo<string | null>(() => {
    if (!fromCurrency || !toCurrency) return null;
    const rate = fromCurrency.latestPrice / toCurrency.latestPrice;
    return `1 ${fromSymbol} = ${nf6.format(rate)} ${toSymbol}`;
  }, [fromCurrency, toCurrency, fromSymbol, toSymbol]);

  const available = 0.00063336;
  const approxUsd = useMemo<string>(() => {
    if (!fromCurrency?.latestPrice) return '0,00';
    return nf2.format(fromAmount * fromCurrency.latestPrice);
  }, [fromAmount, fromCurrency]);

  const minFrom = 0.00000001;
  const valid = fromAmount >= minFrom && fromCurrency && toCurrency;

  // Lógica de confirmação
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

  // --- FUNÇÕES DE MANIPULAÇÃO (HANDLERS) ---
  const handleInvert = (): void => {
    const currentToAmount = toAmount;
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    setFromAmount(parseFloat(currentToAmount.toFixed(8)));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const n = Number(String(e.target.value).replace(',', '.'));
    if (Number.isFinite(n) && n >= 0) setFromAmount(n);
  };

  // --- COMPONENTE DE ÍCONE TIPADO ---
  const AssetIcon: React.FC<AssetIconProps> = ({ sym }) => {
    const s = (sym || '').toUpperCase();
    // Este CSS está embutido pois é dinâmico e simples
    if (s === 'BTC') return <div style={{width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(to bottom right, #f7931a, #f7b90b)', color:'white'}}><SiBitcoin style={{fontSize:14}} /></div>;
    if (s === 'ETH') return <div style={{width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(to bottom right, #627eea, #4d69e0)', color:'white'}}><SiEthereum style={{fontSize:14}} /></div>;
    if (s === 'SOL') return <div style={{width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(to bottom right, #9945ff, #882eff)', color:'white'}}><SiSolana style={{fontSize:14}} /></div>;
    return <div style={{width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(to bottom right, #64748b, #475569)', color:'white', fontSize:10, fontWeight:600}}>{s?.slice(0, 3)}</div>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <button aria-label="Voltar"><FiArrowLeft /></button>
          <h1>Converter</h1>
          <button aria-label="Configurações"><FiSettings /></button>
        </header>

        <div className={styles.tabsContainer}>
          {['Instantânea', 'Recorrente', 'Limite'].map((t, i) => (
            <button key={t} className={i === 0 ? styles.activeTab : styles.tabButton}>{t}</button>
          ))}
        </div>

        <main>
          <div className={styles.card}>
            <div className={styles.labelsRow}>
              <span>De</span>
              <div>
                Disponível {nf8.format(available)} {fromSymbol}{' '}
                <button className={styles.maxButton} onClick={() => setFromAmount(available)}>Máx.</button>
              </div>
            </div>

            <div className={styles.inputRow}>
              <button onClick={() => setOpenMenu(openMenu === 'from' ? null : 'from')} className={styles.currencySelector}>
                <AssetIcon sym={fromSymbol} />
                <span>{fromSymbol}</span>
                <FiChevronDown />
                {openMenu === 'from' && (
                  <div className={styles.currencyMenu}>
                    {currencyData.map((c) => (
                      <button key={`from-${c.symbol}`} className={styles.currencyMenuItem} onClick={() => { setFromSymbol(c.symbol); setOpenMenu(null); if (c.symbol === toSymbol) setToSymbol(fromSymbol); }}>
                        <AssetIcon sym={c.symbol} />
                        <span className={styles.symbol}>{c.symbol}</span>
                        <span className={styles.name}>{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </button>
              <input inputMode="decimal" className={styles.inputField} value={fromAmount} onChange={handleChange} placeholder="0.00" />
            </div>

            <div className={styles.separator}>
              <hr />
              <button onClick={handleInvert} className={styles.invertButton} aria-label="Inverter"><BiTransfer /></button>
            </div>

            <div className={styles.labelsRow}><span>Para</span></div>
            <div className={styles.inputRow}>
              <button onClick={() => setOpenMenu(openMenu === 'to' ? null : 'to')} className={styles.currencySelector}>
                <AssetIcon sym={toSymbol} />
                <span>{toSymbol}</span>
                <FiChevronDown />
                {openMenu === 'to' && (
                  <div className={styles.currencyMenu}>
                    {currencyData.map((c) => (
                      <button key={`to-${c.symbol}`} className={styles.currencyMenuItem} onClick={() => { setToSymbol(c.symbol); setOpenMenu(null); if (c.symbol === fromSymbol) setFromSymbol(toSymbol); }}>
                        <AssetIcon sym={c.symbol} />
                        <span className={styles.symbol}>{c.symbol}</span>
                        <span className={styles.name}>{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </button>
              <div className={styles.outputValue}>{valid ? nf8.format(toAmount) : '0,00000000'}</div>
            </div>
            
            <p className={styles.exchangeRate}>{exchangeRate || '--'}</p>
          </div>

          <div className={styles.previewButtonContainer}>
            <button disabled={!valid} onClick={() => setShowSheet(true)} className={styles.previewButton}>
              Pré-visualização
            </button>
          </div>
        </main>
      </div>

      {showSheet && (
        <div className={styles.bottomSheetBackdrop}>
          <div className={styles.bottomSheetOverlay} onClick={() => (!confirming ? setShowSheet(false) : null)} />
          <div className={styles.bottomSheet}>
            <div className={styles.contentWrapper} style={{padding: 0}}>
              <div className={styles.sheetHeader}>
                <h2>Confirmar ordem</h2>
                <button onClick={() => (!confirming ? setShowSheet(false) : null)} aria-label="Fechar"><FiX /></button>
              </div>

              <div className={styles.sheetBody}>
                <div className={styles.sheetRow}>
                  <div className={styles.sheetAsset}>
                    <AssetIcon sym={fromSymbol} />
                    <span>{fromSymbol}</span>
                  </div>
                  <div className={styles.sheetValue}>{nf8.format(fromAmount)}</div>
                </div>
                <div className={styles.sheetRow}>
                  <div className={styles.sheetAsset}>
                    <AssetIcon sym={toSymbol} />
                    <span>{toSymbol}</span>
                  </div>
                  <div className={styles.sheetValue}>
                    {nf8.format(toAmount)}
                    <span className={styles.sheetApprox}>≈ $ {approxUsd}</span>
                  </div>
                </div>
                <hr className={styles.sheetSeparator} />
                <div className={styles.sheetDetailsGrid}>
                    <div className={styles.sheetDetailItem}><span>Tipo</span><span>Instantânea</span></div>
                    <div className={styles.sheetDetailItem}><span>Taxas</span><span>0 {toSymbol}</span></div>
                    <div className={styles.sheetDetailItem}><span>Taxa</span><span>{exchangeRate || '--'}</span></div>
                </div>
              </div>

              <div className={styles.previewButtonContainer}>
                <button disabled={confirming} onClick={() => setConfirming(true)} className={styles.previewButton}>
                  {confirming ? `Confirmando (${countdown}s)` : `Confirmar (${countdown}s)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}