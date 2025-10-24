'use client';

import { useMemo, useState } from 'react';
import styles from './AssetTable.module.css';

export type AssetRow = {
  symbol: string;
  name: string;
  quantity: number;
  fiatValue: number;
  fiatCurrency: string;
  costBasis: number;
  currentPrice: number;
  pnlToday: number;
  pnlIsPositive: boolean;
  accent: string;
};

type AssetTableProps = {
  assets: AssetRow[];
};

const quantityFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 8,
});

const fiatFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function AssetTable({ assets }: AssetTableProps) {
  const [activeTab, setActiveTab] = useState<'coin' | 'account'>('coin');
  const [hideSmallAssets, setHideSmallAssets] = useState(false);

  const visibleAssets = useMemo(() => {
    if (!hideSmallAssets) {
      return assets;
    }
    return assets.filter((asset) => asset.fiatValue >= 1);
  }, [assets, hideSmallAssets]);

  return (
    <section className={styles.container} aria-labelledby="wallet-assets-heading">
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h2 id="wallet-assets-heading">Meus Ativos</h2>
          <div className={styles.tabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'coin'}
              className={`${styles.tabButton} ${activeTab === 'coin' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('coin')}
            >
              Visualização de Moeda
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'account'}
              className={`${styles.tabButton} ${activeTab === 'account' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Visualizar Conta
            </button>
          </div>
        </div>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={hideSmallAssets}
            onChange={(event) => setHideSmallAssets(event.target.checked)}
          />
          <span>Ocultar ativos &lt; 1 USD</span>
        </label>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Moeda</th>
              <th>Quantidade</th>
              <th>Preço da moeda / Preço de custo</th>
              <th>PNL de Hoje</th>
            </tr>
          </thead>
          <tbody>
            {visibleAssets.map((asset) => {
              const pnlPrefix = asset.pnlIsPositive ? '+' : asset.pnlToday === 0 ? '' : '-';
              const pnlClass = asset.pnlIsPositive
                ? styles.pnlPositive
                : asset.pnlToday === 0
                ? styles.pnlNeutral
                : styles.pnlNegative;

              return (
                <tr key={asset.symbol}>
                  <td>
                    <div className={styles.assetCell}>
                      <span
                        className={styles.assetIcon}
                        style={{
                          background: `linear-gradient(135deg, ${asset.accent}, rgba(55, 65, 81, 0.85))`,
                        }}
                        aria-hidden="true"
                      >
                        {asset.symbol.slice(0, 1)}
                      </span>
                      <div className={styles.assetText}>
                        <span className={styles.assetSymbol}>{asset.symbol}</span>
                        <span className={styles.assetName}>{asset.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.quantityColumn}>
                      <span>{quantityFormatter.format(asset.quantity)}</span>
                      <span className={styles.quantityFiat}>
                        {fiatFormatter.format(asset.fiatValue)} {asset.fiatCurrency}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.priceColumn}>
                      <span>{fiatFormatter.format(asset.currentPrice)} {asset.fiatCurrency}</span>
                      <span className={styles.costBasis}>{fiatFormatter.format(asset.costBasis)} {asset.fiatCurrency}</span>
                    </div>
                  </td>
                  <td>
                    <span className={pnlClass}>
                      {pnlPrefix}
                      {asset.pnlToday === 0
                        ? '--'
                        : `${fiatFormatter.format(Math.abs(asset.pnlToday))} ${asset.fiatCurrency}`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

