'use client';

import { FaLock, FaBolt, FaChartLine, FaMobileAlt } from 'react-icons/fa';
import styles from './FeatureGrid.module.css';

const features = [
  { icon: <FaLock className={styles.featureIcon} />, title: 'Segurança', desc: 'Proteção avançada para seus ativos.' },
  { icon: <FaBolt className={styles.featureIcon} />, title: 'Alta Velocidade', desc: 'Execução de ordens em milissegundos.' },
  { icon: <FaChartLine className={styles.featureIcon} />, title: 'Análises', desc: 'Ferramentas de gráficos e indicadores.' },
  { icon: <FaMobileAlt className={styles.featureIcon} />, title: 'Mobile', desc: 'Acesso completo pelo celular.' },
];

export default function FeatureGrid() {
  return (
    <section className={styles.featureSection}>
      <div className={styles.featureGrid}>
        {features.map((f, i) => (
          <div key={i} className={styles.featureCard}>
            {f.icon}
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}