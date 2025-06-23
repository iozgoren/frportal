// src/components/common/Input.jsx
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  id,
  name,
  type = 'text',
  label = '',
  placeholder = '',
  value = '',
  onChange,
  onBlur,
  error = null,
  fullWidth = false,
  disabled = false,
  required = false,
  autoFocus = false,
  autoComplete = '',
  className = '',
  icon = null,
  iconPosition = 'left',
  ...rest
}, ref) => {
  // Base input styles
  const baseInputStyles = 'appearance-none rounded-md shadow-sm border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50';
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Disabled styles
  const disabledStyles = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '';
  
  // Icon styles and padding
  const hasIcon = !!icon;
  const iconPaddingStyles = hasIcon 
    ? iconPosition === 'left' ? 'pl-10' : 'pr-10' 
    : '';
  
  // Error styles
  const errorStyles = error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
  
  // Combine all input styles
  const inputStyles = [
    baseInputStyles,
    'py-2 px-3 text-sm',
    widthStyles,
    disabledStyles,
    iconPaddingStyles,
    errorStyles,
    className,
  ].join(' ');
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          ref={ref}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          className={inputStyles}
          {...rest}
        />
        
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
};

Input.displayName = 'Input';

export default Input;