'use client';

import styles from './SubmitButton.module.css';

interface SubmitButtonProps {
  label: string;
  disabled?: boolean;
}

export default function SubmitButton({ label, disabled = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${styles.button} ${disabled ? styles.disabled : ''}`}
    >
      {label}
    </button>
  );
}