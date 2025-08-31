import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import Dropdown from "./Dropdown";

interface SearchBarProps {
  onSearch: (text: string, filter: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("date");

  const filterOptions = [
    { label: "Date Registered", value: "date" },
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "Status", value: "status" },
  ];

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch(text, selectedFilter);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onSearch(searchText, value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#354E41"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.spacer} />
      <Dropdown
        options={filterOptions}
        selectedValue={selectedFilter}
        onSelect={handleFilterChange}
        width={150}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 500,
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    borderColor: "#E4E4E7",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    width: "50%", // Make search bar smaller
    marginLeft: -15, // Move search bar a little to the left
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Arial",
    fontSize: 14,
    color: "#354E41",
    height: 32,
  },
  spacer: {
    width: 20, // Space between search bar and dropdown
  },
});

export default SearchBar;