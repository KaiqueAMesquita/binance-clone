import React from 'react';

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

type Props = { data: WalletSummaryData };

const fiatFormatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function WalletSummary({ data }: Props) {
  const weekdays = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
  return (
    <section>
      <h2>Saldo Estimado</h2>
      <div>{data.estimatedBalanceBtc?.toFixed(8)}</div>
      <div>{data.estimatedCurrency}</div>
      <div>~ {fiatFormatter.format(data.estimatedBalanceFiat)} {data.fiatSymbol}</div>
      <div><strong>PNL de Hoje</strong></div>
      <div>
        {weekdays.map(w => <span key={w}>{w}</span>)}
      </div>
    </section>
  );
}
