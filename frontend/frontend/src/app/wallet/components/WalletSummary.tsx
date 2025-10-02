'use client';

import { useMemo, useId } from 'react';
import { FaChevronDown, FaEye } from 'react-icons/fa';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';
import styles from './WalletSummary.module.css';

export type WalletSummaryData = {
  estimatedBalanceBtc: number;
  estimatedCurrency: string;
  estimatedBalanceFiat: number;
  fiatSymbol: string;
  pnlToday: {
    value: number;
    percentage: number;
    currency: string;
    isPositive: boolean;
  };
};

type WalletSummaryProps = {
  data: WalletSummaryData;
};

type BalanceHistoryPoint = {
  label: string;
  value: number;
  fiatValue: number;
};

const mockBalanceHistory: BalanceHistoryPoint[] = [
  { label: 'SEG', value: 0.00162, fiatValue: 195.24 },
  { label: 'TER', value: 0.00168, fiatValue: 202.32 },
  { label: 'QUA', value: 0.00171, fiatValue: 206.87 },
  { label: 'QUI', value: 0.00165, fiatValue: 199.05 },
  { label: 'SEX', value: 0.00174, fiatValue: 210.44 },
  { label: 'SAB', value: 0.00179, fiatValue: 216.12 },
  { label: 'DOM', value: 0.00187, fiatValue: 225.59 },
];

const btcFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 8,
  maximumFractionDigits: 8,
});

const fiatFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function WalletSummary({ data }: WalletSummaryProps) {
  const gradientBaseId = useId();
  const areaGradientId = `${gradientBaseId}-area`;
  const lineGradientId = `${gradientBaseId}-line`;

  const historySummary = useMemo(() => {
    if (mockBalanceHistory.length === 0) {
      return {
        linePoints: '',
        areaPoints: '',
        coordinates: [] as Array<{ x: number; y: number }>,
        last: { label: '', value: 0, fiatValue: 0 },
        percentChange: 0,
      };
    }

    const values = mockBalanceHistory.map((point) => point.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    const coordinates = mockBalanceHistory.map((point, index) => {
      if (mockBalanceHistory.length === 1) {
        return { x: 50, y: 50 };
      }

      const x = (index / (mockBalanceHistory.length - 1)) * 100;
      const y = range === 0 ? 50 : ((maxValue - point.value) / range) * 100;

      return {
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
      };
    });

    const linePoints = coordinates.map((coord) => `${coord.x},${coord.y}`).join(' ');
    const areaPoints = `0,100 ${linePoints} 100,100`;

    const first = mockBalanceHistory[0];
    const last = mockBalanceHistory[mockBalanceHistory.length - 1];
    const delta = last.value - first.value;
    const percentChange = first.value === 0 ? 0 : (delta / first.value) * 100;

    return {
      linePoints,
      areaPoints,
      coordinates,
      last,
      percentChange,
    };
  }, []);

  const pnlArrow = data.pnlToday.isPositive ? (
    <RiArrowUpSFill className={styles.pnlPositive} aria-hidden="true" />
  ) : (
    <RiArrowDownSFill className={styles.pnlNegative} aria-hidden="true" />
  );

  const pnlPrefix = data.pnlToday.isPositive ? '+' : '-';
  const pnlValue = `${pnlPrefix}${fiatFormatter.format(Math.abs(data.pnlToday.value))} ${data.pnlToday.currency}`;
  const pnlPercent = `${pnlPrefix}${percentFormatter.format(Math.abs(data.pnlToday.percentage))}%`;

  const trendPositive = historySummary.percentChange >= 0;
  const chartPercentLabel = percentFormatter.format(Math.abs(historySummary.percentChange));
  const chartLastFiat = fiatFormatter.format(historySummary.last.fiatValue);
  const lastCoordinate = historySummary.coordinates[historySummary.coordinates.length - 1];

  return (
    <section className={styles.container} aria-labelledby="wallet-balance-heading">
      <div className={styles.balanceSection}>
        <div className={styles.balanceHeader}>
          <span id="wallet-balance-heading" className={styles.balanceLabel}>
            Saldo Estimado
          </span>
          <button className={styles.iconButton} type="button" aria-label="Alternar visibilidade do saldo">
            <FaEye size={16} />
          </button>
        </div>
        <div className={styles.balanceValue}>
          <span className={styles.primaryValue}>{btcFormatter.format(data.estimatedBalanceBtc)}</span>
          <span className={styles.primaryCurrency}>{data.estimatedCurrency}</span>
        </div>
        <div className={styles.balanceFiat}>
          <span>~ {fiatFormatter.format(data.estimatedBalanceFiat)} {data.fiatSymbol}</span>
        </div>
        <div className={styles.pnlRow}>
          <span className={styles.pnlLabel}>PNL de Hoje</span>
          <div className={styles.pnlValue}>
            {pnlArrow}
            <span className={styles.pnlAmount}>{pnlValue}</span>
            <span className={styles.pnlPercent}>{pnlPercent}</span>
          </div>
        </div>
        <button className={styles.balanceDropdown} type="button" aria-label="Selecionar moeda de visualizacao">
          <span>{data.estimatedCurrency}</span>
          <FaChevronDown size={12} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.actionSection}>
        <div className={styles.actions}>
          <button className={`${styles.actionButton} ${styles.deposit}`} type="button">
            Deposito
          </button>
          <button className={styles.actionButton} type="button">
            Saque
          </button>
          <button className={styles.actionButton} type="button">
            Transferir
          </button>
          <button className={styles.actionButton} type="button">
            Historico
          </button>
        </div>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <span>Ultimos 7 dias</span>
            <FaChevronDown size={10} aria-hidden="true" />
          </div>
          <div className={styles.chartSummary}>
            <div className={styles.chartSummaryLeft}>
              <span className={styles.chartValue}>
                {btcFormatter.format(historySummary.last.value)}
                <span className={styles.chartCurrency}>{data.estimatedCurrency}</span>
              </span>
              <span className={styles.chartFiat}>~ {chartLastFiat} {data.fiatSymbol}</span>
            </div>
            <span
              className={`${styles.chartDelta} ${trendPositive ? styles.chartDeltaPositive : styles.chartDeltaNegative}`}
            >
              {trendPositive ? '+' : '-'}{chartPercentLabel}%
            </span>
          </div>
          <div className={styles.chartCanvas}>
            <svg
              className={styles.chartSvg}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              role="img"
              aria-label="Evolucao do saldo estimado nos ultimos sete dias"
              focusable="false"
            >
              <defs>
                <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(252, 213, 53, 0.55)" />
                  <stop offset="100%" stopColor="rgba(252, 213, 53, 0)" />
                </linearGradient>
                <linearGradient id={lineGradientId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fcd535" />
                  <stop offset="100%" stopColor="#f0b90b" />
                </linearGradient>
              </defs>
              {historySummary.areaPoints && (
                <polygon points={historySummary.areaPoints} fill={`url(#${areaGradientId})`} />
              )}
              {historySummary.linePoints && (
                <polyline
                  points={historySummary.linePoints}
                  fill="none"
                  stroke={`url(#${lineGradientId})`}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {lastCoordinate && (
                <circle
                  cx={lastCoordinate.x}
                  cy={lastCoordinate.y}
                  r="2.6"
                  fill="#fcd535"
                  stroke="#111827"
                  strokeWidth="1"
                />
              )}
            </svg>
            <div className={styles.chartLabels}>
              {mockBalanceHistory.map((point) => (
                <span key={point.label}>{point.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}