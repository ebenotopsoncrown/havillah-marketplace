import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export default function ValidatedInput({ 
  label, 
  value, 
  onChange, 
  type = "text",
  required = false,
  validation,
  errorMessage,
  ...props 
}) {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    if (required && !value) {
      setError(`${label} is required`);
      return;
    }
    
    if (value && validation) {
      const isValid = validation(value);
      if (!isValid) {
        setError(errorMessage || `Invalid ${label.toLowerCase()}`);
      } else {
        setError('');
      }
    }
  };

  const handleChange = (e) => {
    onChange(e);
    if (touched) {
      setError('');
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Input
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={error ? 'border-red-500' : ''}
        {...props}
      />
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}