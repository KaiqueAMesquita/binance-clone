interface SubmitButtonProps {
    label: string;
    disabled?: boolean;
  }
  
  export default function SubmitButton({ label, disabled = false }: SubmitButtonProps) {
    return (
      <button
        type="submit"
        disabled={disabled}
        className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {label}
      </button>
    );
  }
  