import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

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
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="series-joined-label">Series Joined</InputLabel>
      <Select
        labelId="series-joined-label"
        id="series-joined"
        value={joinedSeries}
        onChange={handleChange}
        label="Series Joined">
        {SERIES_LIST.map((series) => (
          <MenuItem key={series} value={series}>
            {series.charAt(0).toUpperCase() + series.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
