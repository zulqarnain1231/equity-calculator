import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Template } from "../utils/templates"; // make sure to import Template type correctly if needed

interface TemplateDropdownProps {
  handleTemplateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  templates: Template[];
}

export const TemplateDropdown: React.FC<TemplateDropdownProps> = ({
  handleTemplateChange,
  templates,
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string>("");
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedValue(value);
    handleTemplateChange(
      event as unknown as React.ChangeEvent<HTMLSelectElement>
    );
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="template-dropdown-label">Choose a Template</InputLabel>
      <Select
        labelId="template-dropdown-label"
        id="template-dropdown"
        onChange={handleChange}
        defaultValue=""
        value={selectedValue}
        label="Choose a Template">
        <MenuItem value="">
          <em>Select a template</em>
        </MenuItem>
        {templates.map((template, idx) => (
          <MenuItem key={idx} value={template.name}>
            {template.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
