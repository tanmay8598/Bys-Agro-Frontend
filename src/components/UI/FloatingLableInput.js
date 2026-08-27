

import { useState } from "react";

export default function FloatingLabelInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  helperText,
  required = false,
  maxLength,
  pattern,
  inputMode,
  onKeyDown,
  onPaste,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isActive = isFocused || hasValue;

  return (
    <div className="relative">
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          maxLength={maxLength}
          pattern={pattern}
          inputMode={inputMode}
          className={`
            w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent
            bg-[#faf4ea] transition-all duration-200 text-[#2b1b12]
            ${isActive ? "pt-5 pb-1" : "py-3"}
            ${
              error
                ? "border-red-500 focus:ring-red-500 bg-red-50"
                : "border-[#e6ded2] focus:ring-[#c1552c]"
            }
          `}
        />
        <label
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${
              isActive
                ? "text-xs top-1 text-[#8a8179]"
                : "text-[#8a8179] top-1/2 transform -translate-y-1/2"
            }
            ${error ? "text-red-500" : ""}
          `}
        >
          {label}
          {required && " *"}
        </label>
      </div>

      {helperText && !error && (
        <p className="text-xs text-[#8a8179] mt-1">{helperText}</p>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}