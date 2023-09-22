import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Template } from "../utils/templates"; // make sure to import Template type correctly if needed

interface TemplateDropdownProps {
  handleTemplateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  templates: Template[];
}

const NewTemplatesDropDown: React.FC<TemplateDropdownProps> = ({
  handleTemplateChange,
  templates,
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string>("More");
  const handleChange = (event: any) => {
    const value = event.target.value;
    setSelectedValue(value);
    handleTemplateChange(
      event as unknown as React.ChangeEvent<HTMLSelectElement>
    );
  };

  return (
    <Select
      labelId="template-dropdown-label"
      id="template-dropdown"
      onChange={handleChange}
      defaultValue="More"
      value={selectedValue}
      input={<OutlinedInput />}
      label="Choose a Template"
      sx={{
        fontFamily: "Inter",
        "& .MuiInputBase-root .MuiOutlinedInput-root": {
          borderRadius: "20px",
        },
      }}
    >
      <MenuItem value="More">More</MenuItem>
      {templates.map((template, idx) => (
        <MenuItem key={idx} value={template.name}>
          {template.name}
        </MenuItem>
      ))}
    </Select>
  );
};
export default NewTemplatesDropDown;
