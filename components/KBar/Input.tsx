import { SearchSharp } from "@mui/icons-material";
import { Input, InputBaseComponentProps } from "@mui/material";
import { KBarSearch } from "kbar";
import { forwardRef, useContext } from "react";
import DarkMode from "../Context/DarkMode";

export default function KBarInput() {
  const darkMode = useContext(DarkMode);
  return (
    <Input
      startAdornment={<SearchSharp />}
      sx={{
        width: "100%",
        paddingLeft: 1,
        borderRadius: "0.25rem",
        backgroundColor: darkMode ? "rgb(30,60,90)" : "rgba(255,255,255,0.9)",
      }}
      inputComponent={ReffedSearchBar}
    />
  );
}

function SearchBar(props: InputBaseComponentProps): React.ReactElement {
  const darkMode = useContext(DarkMode);
  return (
    <KBarSearch
      {...props}
      style={{
        width: "100%",
        backgroundColor: "transparent",
        borderBottom: "2px solid rgba(149, 157, 165, 0.2)",
        padding: "1rem 0.5rem",
        fontSize: "1.5rem",
        borderWidth: 0,
        outline: 0,
        color: darkMode ? "#f0f0f0" : "#111",
      }}
    />
  );
}

// eslint-disable-next-line react/display-name
const ReffedSearchBar = forwardRef((props: InputBaseComponentProps) => (
  <SearchBar {...props} />
));
