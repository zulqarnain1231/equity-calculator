import React from "react";
import { TextField } from "@mui/material";

interface SimpleInputProps {
  value: number;
  setValue: any;
  label: string;
}
const SimpleInput: React.FC<SimpleInputProps> = ({
  value,
  setValue,
  label,
}: SimpleInputProps) => {
  return (
    <div className="w-[220px] flex flex-col items-start justify-start gap-2">
      <p className="text-sm text-black font-normal">{label}</p>
      <TextField
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        sx={{
          fontFamily: "Inter",
          "& .MuiOutlinedInput-root": {
            borderRadius: "9px",
            height: "92px",
          },
        }}
        value={value}
        onChange={setValue}
        variant="outlined"
      />
    </div>
  );
};

export default SimpleInput;
