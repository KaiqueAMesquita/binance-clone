'use client';

import InputMask from 'react-input-mask';
import styles from './FormInput.module.css';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  mask?: string;
}

export default function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  mask,
}: FormInputProps) {
  return (
    <div>
      <label className={styles.label}>{label}</label>
      {mask ? (
        <InputMask
          mask={mask}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.input}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.input}
        />
      )}
    </div>
  );
}