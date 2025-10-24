'use client';

import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.bannerTitle}>Seja bem vindo a Binance</h1>
        <p className={styles.bannerStats}>271,299,832</p>
        <p className={styles.bannerSubtext}>USUÁRIOS CONFIAM EM NÓS</p>
      </div>
    </section>
  );
}