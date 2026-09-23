import React, { useState, forwardRef, useId } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  labelClassName?: string
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, labelClassName = '', error, helperText, leftIcon, rightIcon, type = 'text', id, disabled, required, className = '', containerClassName = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || useId();
    const isPassword = type === 'password';

    const pLeft = leftIcon ? 'pl-10' : 'pl-3.5';
    const pRight = isPassword || rightIcon ? 'pr-10' : 'pr-3.5';
    const stateStyle = error ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:ring-1 focus:ring-primary focus:border-primary';
    const disableStyle = disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : '';

    return (
      <div className={`w-full ${containerClassName}`.trim()}>
       {label && (
          <label htmlFor={inputId} className={`block text-sm font-semibold text-gray-700 mb-1.5 select-none ${labelClassName}`.trim()}>
            {label} {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center">{leftIcon}</div>}
          
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            disabled={disabled}
            required={required}
            className={`w-full bg-white text-sm rounded-lg py-2.5 text-gray-800 placeholder:text-gray-400 border transition-all outline-none ${pLeft} ${pRight} ${stateStyle} ${disableStyle} ${className}`.trim()}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer transition-colors disabled:cursor-not-allowed"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3.5 text-gray-400 pointer-events-none flex items-center">{rightIcon}</div>
          ) : null}
        </div>

        {error ? (
          <p className="flex items-center space-x-1 text-xs text-red-500 mt-1.5 font-medium"><AlertCircle size={13} className="shrink-0" /><span>{error}</span></p>
        ) : helperText ? (
          <p className="text-xs text-gray-500 mt-1.5 leading-snug">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';