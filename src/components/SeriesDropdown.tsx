import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
const SERIES_LIST = ["preseed", "seed", "A", "B", "C", "D", "E", "F"];

interface SeriesJoinedDropdownProps {
  joinedSeries: string;
  setJoinedSeries: React.Dispatch<React.SetStateAction<string>>;
}

export const SeriesJoinedDropdown: React.FC<SeriesJoinedDropdownProps> = ({
  joinedSeries,
  setJoinedSeries,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    setJoinedSeries(event.target.value as string);
  };

  return (
    <div className="w-[220px] flex flex-col items-start justify-start gap-2">
      <p className="text-black text-sm font-normal">Series Joined</p>
      <Select
        labelId="series-joined-label"
        id="series-joined"
        value={joinedSeries}
        onChange={handleChange}
        input={<OutlinedInput />}
        sx={{
          width: "100%",
          height: "92px",
          fontFamily: "Inter",
          borderRadius: "9px",
        }}
      >
        {SERIES_LIST.map((series) => (
          <MenuItem key={series} value={series}>
            {series.charAt(0).toUpperCase() + series.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
