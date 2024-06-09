import { ChangeEvent } from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-gray-300 px-3 py-2 rounded"
      />
    </div>
  );
};

export default InputField;
