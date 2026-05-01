"use client";

import { useRef } from "react";
import { TextField, Box } from "@mui/material";

type UiPinInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
};

export function UiPinInput({
  length = 6,
  value,
  onChange,
  disabled,
  error,
}: UiPinInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return; // numeric only

    const newValue =
      value.split("").slice(0, length);

    newValue[index] = val;
    const joined = newValue.join("").slice(0, length);

    onChange(joined);

    // move next
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    onChange(pasted);
  };

  return (
    <Box className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <TextField
          key={index}
          inputRef={(el) => {
            inputsRef.current[index] = el;
          }}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          error={error}
          slotProps={{
  htmlInput: {
    maxLength: 1,
    style: {
      textAlign: "center",
      fontSize: "18px",
      fontWeight: 600,
    },
  },
}}
          sx={{
            width: 40,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />
      ))}
    </Box>
  );
}