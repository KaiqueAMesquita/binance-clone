import { FaArrowRight } from 'react-icons/fa';
import styles from './PromotionalCards.module.css';

export type PromotionCard = {
  title: string;
  subtitle?: string;
  cta: string;
  variant?: 'primary' | 'secondary';
};

type PromotionalCardsProps = {
  cards: PromotionCard[];
};

export default function PromotionalCards({ cards }: PromotionalCardsProps) {
  return (
    <section className={styles.container} aria-label="Ações rápidas">
      {cards.map((card) => (
        <article
          key={card.title}
          className={`${styles.card} ${card.variant === 'primary' ? styles.primary : styles.secondary}`}
        >
          <div className={styles.content}>
            <h3>{card.title}</h3>
            {card.subtitle && <p>{card.subtitle}</p>}
            <button className={styles.cta} type="button">
              {card.cta}
              <FaArrowRight size={12} aria-hidden="true" />
            </button>
          </div>
          <div className={styles.badge} aria-hidden="true">
            <span></span>
          </div>
        </article>
      ))}
    </section>
  );
}
