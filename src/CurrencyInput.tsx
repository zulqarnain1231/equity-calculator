import { useEffect, useState } from "react";

interface CurrencyInputProps {
  value: number;
  onChange: (newValue: number) => void; // expects a number, not an event
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  className,
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
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      className={className}
    />
  );
};
