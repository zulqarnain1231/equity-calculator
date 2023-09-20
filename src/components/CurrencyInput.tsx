import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface CurrencyInputProps {
  value: number;
  onChange: (newValue: number) => void; // expects a number, not an event
  label?: string;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  className,
  label,
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    setDisplayValue(new Intl.NumberFormat().format(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value.replace(/,/g, ""));
    if (isNaN(value)) value = 0;
    setDisplayValue(new Intl.NumberFormat().format(value));
    onChange(value); // directly call with the parsed value
  };

  return (
    <TextField
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      value={displayValue}
      onChange={handleChange}
      className={className}
      label={label}
    />
  );
};
