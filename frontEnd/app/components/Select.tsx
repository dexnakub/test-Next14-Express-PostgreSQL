import React, { ChangeEvent } from 'react';

interface SelectProps {
    id: string;
    label: string;
    value: string | number | readonly string[];
    options: any[];
    require?: boolean;
    disabled?: boolean;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({ id, label, value, require, options, onChange, disabled }) => {

    return (
        <>
            <div className="mb-4">
                <label htmlFor={id}>{label}</label>
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    required={require} 
                    disabled={disabled}
                    className="w-full border border-gray-300 px-3 py-2 rounded mt-2"
                >
                    {options.map((optionValue, index) => (
                        <option key={index} value={optionValue.id}>
                             {optionValue.name_th}
                        </option>
                    ))}

                </select>
            </div>
        </>
    );
};

export default Select;
