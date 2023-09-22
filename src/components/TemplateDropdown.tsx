import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
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
        fontSize: "14px",
        fontWeight: 600,
        height: "36px",
        borderRadius: "20px",
        border: "0px",
        backgroundColor: "#D9D9D9",
        paddingX: "10px",
        "&.MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "transparent",
          },
          "&:hover fieldset": {
            borderColor: "transparent",
          },

          "&.Mui-focused fieldset": {
            borderColor: "transparent",
          },
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
