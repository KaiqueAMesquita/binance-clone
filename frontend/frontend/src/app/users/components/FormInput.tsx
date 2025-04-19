import InputMask from "react-input-mask";

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
  type = "text",
  mask,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-yellow-400 mb-1">{label}</label>
      {mask ? (
        <InputMask
          mask={mask}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
        />
      )}
    </div>
  );
}
