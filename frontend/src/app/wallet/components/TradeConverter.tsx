'use client';

import { useEffect, useMemo, useState } from 'react';
import { SiBitcoin, SiEthereum, SiSolana } from 'react-icons/si';
import { BiTransfer } from 'react-icons/bi';
import { FiChevronDown, FiArrowLeft, FiSettings, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { currencyAPI } from '@/services/CurrencyService';
import { walletService, BackendWallet, BackendTransaction } from '@/services/WalletService';
import { useRouter } from 'next/navigation';
import styles from './TradeConverter.module.css';

// --- TIPOS ---
interface ProcessedCurrency {
  symbol: string;
  name: string;
  latestPrice: number;
}

interface AssetIconProps {
  sym: string;
}

// --- FORMATADORES ---
const nf8 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
const nf6 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 6 });
const nf2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TradeConverter() {
  const [currencyData, setCurrencyData] = useState<ProcessedCurrency[]>([]);
  const [userWallets, setUserWallets] = useState<BackendWallet[]>([]);

  const [fromSymbol, setFromSymbol] = useState<string>('BTC');
  const [toSymbol, setToSymbol] = useState<string>('ETH');

  const [openMenu, setOpenMenu] = useState<'from' | 'to' | null>(null);
  const [fromAmount, setFromAmount] = useState<number>(0);

  const [confirming, setConfirming] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(6);
  const [showSheet, setShowSheet] = useState<boolean>(false);

  const router = useRouter();

  // 1. CARREGAMENTO INICIAL
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const [currenciesList, walletsList] = await Promise.all([
          currencyAPI.getAll(),
          walletService.listWallets()
        ]);

        if (!active) return;

        // Processa lista de moedas do mercado
        const processedList: ProcessedCurrency[] = currenciesList
          .map((c) => {
            // Se não tiver histórico, assume preço 0 (será corrigido no useMemo abaixo)
            let price = 0;
            if (c.histories && c.histories.length > 0) {
                const latest = c.histories.reduce((prev, current) =>
                    (new Date(prev.datetime) > new Date(current.datetime)) ? prev : current
                );
                price = latest.price;
            }
            
            return {
              symbol: c.symbol.toUpperCase(),
              name: c.name || c.symbol,
              latestPrice: price,
            };
          })
          .filter((c): c is ProcessedCurrency => c !== null);

        // Ordenação visual
        processedList.sort((a, b) => {
          const prio = (s: string) => (s === 'USDT' ? 0 : s === 'BTC' ? 1 : s === 'ETH' ? 2 : 3);
          const d = prio(a.symbol) - prio(b.symbol);
          return d !== 0 ? d : a.symbol.localeCompare(b.symbol);
        });

        setCurrencyData(processedList);
        setUserWallets(walletsList);

        // Seleção automática inteligente
        const richWallet = walletsList.find(w => Number(w.balance) > 0);
        const anyWallet = walletsList[0];

        let initialFrom = 'BTC';
        if (richWallet) initialFrom = richWallet.currency;
        else if (anyWallet) initialFrom = anyWallet.currency;
        else if (processedList.length > 0) initialFrom = processedList[0].symbol;
        
        setFromSymbol(initialFrom);

        // Tenta selecionar um destino diferente e válido
        const target = processedList.find(c => c.symbol !== initialFrom);
        if (target) setToSymbol(target.symbol);

      } catch (err: unknown) {
        console.error('Falha ao carregar dados', err);
        toast.error('Erro de conexão.');
      }
    };

    fetchData();
    return () => { active = false; };
  }, []);

  // --- LÓGICA DE PREÇOS COM FALLBACK (CORREÇÃO DO ZERO) ---
  const getPrice = (symbol: string) => {
    const found = currencyData.find(c => c.symbol === symbol);
    
    // CORREÇÃO CRÍTICA: Se for Stablecoin ou Dólar e não tiver preço no banco, força 1
    if (symbol === 'USDT' || symbol === 'USD' || symbol === '$') {
        return found?.latestPrice || 1; 
    }
    return found?.latestPrice || 0;
  };

  const priceFrom = useMemo(() => getPrice(fromSymbol), [currencyData, fromSymbol]);
  const priceTo = useMemo(() => getPrice(toSymbol), [currencyData, toSymbol]);

  // --- LISTAS DE MENU ---
  const ownedCurrencies = useMemo(() => {
    return userWallets
      .filter(w => Number(w.balance) > 0)
      .map(w => ({
        symbol: w.currency,
        name: currencyData.find(c => c.symbol === w.currency)?.name || w.currency
      }));
  }, [userWallets, currencyData]);

  const fromWallet = useMemo(() => userWallets.find(w => w.currency === fromSymbol), [userWallets, fromSymbol]);
  const available = useMemo(() => fromWallet ? Number(fromWallet.balance) : 0, [fromWallet]);

  // CÁLCULO DE CONVERSÃO
  const toAmount = useMemo<number>(() => {
    if (!priceFrom || !priceTo) return 0;
    const rate = priceFrom / priceTo;
    return fromAmount * rate;
  }, [fromAmount, priceFrom, priceTo]);

  const exchangeRate = useMemo<string>(() => {
    if (!priceFrom || !priceTo) return '--';
    const rate = priceFrom / priceTo;
    return `1 ${fromSymbol} ≈ ${nf6.format(rate)} ${toSymbol}`;
  }, [priceFrom, priceTo, fromSymbol, toSymbol]);

  const approxUsd = useMemo<string>(() => {
    // Se a moeda de origem for USD/USDT, o valor é o próprio amount
    if (fromSymbol === 'USDT' || fromSymbol === '$') return nf2.format(fromAmount);
    return nf2.format(fromAmount * priceFrom);
  }, [fromAmount, priceFrom, fromSymbol]);

  const valid = fromAmount > 0 && fromAmount <= available && priceTo > 0;

  // --- TIMER ---
  useEffect(() => {
    if (!showSheet || processing) return;
    if (countdown === 0) {
      setConfirming(false);
      setShowSheet(false);
      setCountdown(6);
      return;
    }
    const t = setTimeout(() => setCountdown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [showSheet, countdown, processing]);

  useEffect(() => {
    if (showSheet) setCountdown(6);
  }, [showSheet]);

  // --- HANDLERS ---
  const handleInvert = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    setFromAmount(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(',', '.');
    const n = Number(raw);
    if (!Number.isNaN(n) && n >= 0) setFromAmount(n);
    else if (raw === '') setFromAmount(0);
  };

  const executeTrade = async () => {
    if (!fromWallet) return;
    setProcessing(true);
    setConfirming(true);

    try {
      let toWallet = userWallets.find(w => w.currency === toSymbol);
      
      if (!toWallet) {
          toWallet = await walletService.createWallet(toSymbol, fromWallet.userId);
      }

      const tx: Partial<BackendTransaction> = {
        walletId: fromWallet.id,
        destinyWalletId: toWallet.id, // Garante que o ID existe agora
        amount: fromAmount,
        fromCurrency: fromSymbol,
        toCurrency: toSymbol,
        type: 3, 
        status: 1 
      };

      await walletService.addTransaction(fromWallet.id, tx);
      toast.success('Sucesso!');
      
      setShowSheet(false);
      setFromAmount(0);
      const updatedWallets = await walletService.listWallets();
      setUserWallets(updatedWallets);

    } catch (error: any) {
      toast.error("Falha na conversão.");
    } finally {
      setProcessing(false);
      setConfirming(false);
    }
  };

  const AssetIcon: React.FC<AssetIconProps> = ({ sym }) => {
    const s = (sym || '').toUpperCase();
    let bg = 'linear-gradient(to bottom right, #64748b, #475569)';
    let content = <span style={{fontSize:10, fontWeight:600}}>{s.slice(0,3)}</span>;
    
    if (s === 'BTC') { bg = '#f7931a'; content = <SiBitcoin size={14} />; }
    else if (s === 'ETH') { bg = '#627eea'; content = <SiEthereum size={14} />; }
    else if (s === 'SOL') { bg = '#9945ff'; content = <SiSolana size={14} />; }
    else if (s === 'USDT') { bg = '#26A17B'; content = <span style={{fontWeight:'bold', fontSize:10}}>T</span>; }
    else if (s === '$' || s === 'USD') { bg = '#22c55e'; content = <span style={{fontWeight:'bold', fontSize:12}}>$</span>; }

    return (
        <div style={{
            width: 28, height: 28, borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            background: bg, color: 'white'
        }}>
            {content}
        </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <button onClick={() => router.back()}><FiArrowLeft /></button>
          <h1>Converter</h1>
          <button><FiSettings /></button>
        </header>

        <div className={styles.tabsContainer}>
          <button className={styles.activeTab}>Instantânea</button>
          <button className={styles.tabButton}>Recorrente</button>
          <button className={styles.tabButton}>Limite</button>
        </div>

        <main>
          <div className={styles.card}>
            {/* FROM */}
            <div className={styles.labelsRow}>
              <span>De</span>
              <div>
                <span style={{ color: fromAmount > available ? '#ef4444' : 'inherit' }}>
                  Disponível {nf8.format(available)} {fromSymbol}
                </span>{' '}
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
                    {ownedCurrencies.length > 0 ? (
                      ownedCurrencies.map((c) => (
                        <button key={c.symbol} className={styles.currencyMenuItem} onClick={() => { setFromSymbol(c.symbol); setOpenMenu(null); if(c.symbol === toSymbol) setToSymbol(fromSymbol === 'USDT' ? 'BTC' : 'USDT'); }}>
                          <AssetIcon sym={c.symbol} />
                          <span className={styles.symbol}>{c.symbol}</span>
                          <span className={styles.name}>{c.name}</span>
                        </button>
                      ))
                    ) : <div className={styles.emptyMenu}>Sem saldo</div>}
                  </div>
                )}
              </button>
              <input type="number" className={styles.inputField} value={fromAmount || ''} onChange={handleChange} placeholder="0.00" />
            </div>

            <div className={styles.separator}>
                <hr />
                <button onClick={handleInvert} className={styles.invertButton}><BiTransfer /></button>
            </div>

            {/* TO */}
            <div className={styles.labelsRow}><span>Para</span></div>
            <div className={styles.inputRow}>
              <button onClick={() => setOpenMenu(openMenu === 'to' ? null : 'to')} className={styles.currencySelector}>
                <AssetIcon sym={toSymbol} />
                <span>{toSymbol}</span>
                <FiChevronDown />
                {openMenu === 'to' && (
                  <div className={styles.currencyMenu}>
                    {currencyData.map((c) => (
                      <button key={c.symbol} className={styles.currencyMenuItem} onClick={() => { setToSymbol(c.symbol); setOpenMenu(null); if(c.symbol === fromSymbol) setFromSymbol(toSymbol === 'USDT' ? 'BTC' : 'USDT'); }}>
                        <AssetIcon sym={c.symbol} />
                        <span className={styles.symbol}>{c.symbol}</span>
                        <span className={styles.name}>{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </button>
              <div className={styles.outputValue}>{toAmount > 0 ? nf8.format(toAmount) : '0,00000000'}</div>
            </div>

            <p className={styles.exchangeRate}>{exchangeRate}</p>
          </div>

          <div className={styles.previewButtonContainer}>
            <button disabled={!valid} onClick={() => setShowSheet(true)} className={styles.previewButton}>
              Pré-visualização
            </button>
          </div>
        </main>
      </div>

      {/* --- MODAL (SHEET) CORRIGIDO --- */}
      {showSheet && (
        <div className={styles.bottomSheetBackdrop}>
          <div className={styles.bottomSheetOverlay} onClick={() => !processing && setShowSheet(false)} />
          <div className={styles.bottomSheet}>
            <div className={styles.sheetHeader}>
                <h2>Confirmar conversão</h2>
                <button onClick={() => !processing && setShowSheet(false)}><FiX size={20}/></button>
            </div>

            <div className={styles.sheetContent}>
                <div className={styles.sheetRow}>
                    <div className={styles.sheetAssetGroup}>
                        <AssetIcon sym={fromSymbol} />
                        <div className={styles.sheetAssetInfo}>
                            <span className={styles.sheetAssetSymbol}>{fromSymbol}</span>
                            <span className={styles.sheetAssetLabel}>De</span>
                        </div>
                    </div>
                    <span className={styles.sheetValue}>{nf8.format(fromAmount)}</span>
                </div>

                <div className={styles.sheetIconRow}>
                    <BiTransfer size={18} color="#6B7280" style={{transform: 'rotate(90deg)'}}/>
                </div>

                <div className={styles.sheetRow}>
                    <div className={styles.sheetAssetGroup}>
                        <AssetIcon sym={toSymbol} />
                        <div className={styles.sheetAssetInfo}>
                            <span className={styles.sheetAssetSymbol}>{toSymbol}</span>
                            <span className={styles.sheetAssetLabel}>Para</span>
                        </div>
                    </div>
                    <div className={styles.sheetValueColumn}>
                        <span className={styles.sheetValueMain}>{nf8.format(toAmount)}</span>
                        <span className={styles.sheetValueSub}>≈ $ {approxUsd}</span>
                    </div>
                </div>

                <div className={styles.sheetCardDetails}>
                    <div className={styles.detailRow}>
                        <span>Cotação</span>
                        <span>{exchangeRate}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span>Método</span>
                        <span>Carteira Spot</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span>Taxa</span>
                        <span style={{color: '#22c55e'}}>Isento</span>
                    </div>
                </div>

                <button 
                    disabled={processing} 
                    onClick={executeTrade} 
                    className={styles.confirmButton}
                >
                    {processing ? 'Processando...' : `Converter Agora (${countdown}s)`}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}