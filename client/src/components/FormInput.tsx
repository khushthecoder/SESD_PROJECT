import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label, name, type = "text", value, onChange, error, placeholder, required = false, disabled = false,
}) => {
  return (
    <div className={`form-group ${error ? "has-error" : ""}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <input
        id={name} name={name} type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required} disabled={disabled}
        className="form-input" aria-invalid={!!error}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  error?: string;
  required?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label, name, value, onChange, options, error, required = false,
}) => {
  return (
    <div className={`form-group ${error ? "has-error" : ""}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <select id={name} name={name} value={value} onChange={onChange} required={required} className="form-select">
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
