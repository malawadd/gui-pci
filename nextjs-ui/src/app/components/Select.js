import React from 'react';

const Select = ({ options, value, onChange, placeholder }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md p-2"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
