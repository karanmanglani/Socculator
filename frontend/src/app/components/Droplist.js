'use client'; 
import React, { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input } from "@nextui-org/react";

export default function Droplist({ list = [], getvalue }) {
  // State to store the selected item to display on the button
  const [selectedItem, setSelectedItem] = useState("Open List");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredItems, setFilteredItems] = useState(list); // State for filtered list

  // Function to handle selection of a dropdown item
  const handleSelect = (key) => {
    const item = filteredItems[key];  // Get the actual item based on the key (filtered list)
    setSelectedItem(item);            // Update the button text with the selected item
    getvalue(item);                   // Pass the selected item to the parent component
  };

  // Function to handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Filter the list based on the search term
    const filtered = list.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered); // Update the filtered items state
  };

  return (
    <div style={{display:'flex',justifyContent:"space-evenly"}}>
      {/* Search input outside the dropdown */}
      <div style={{paddingRight:'50px'}}>
      <Input
      className="serch-box hover:border-cyan-400"
        clearable
        placeholder="Search..."
        onChange={handleSearch}
        value={searchTerm}
        autoFocus
        fullWidth
        style={{ marginBottom: '1rem' ,color:'blue',fontWeight:'800',fontSize:'18px'}} 
        // Add some margin for spacing
      />
      </div>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">
            {selectedItem} {/* Show the selected item on the button */}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dynamic Actions"
          onAction={(key) => handleSelect(key)}
        >
          {/* Map over the filtered list */}
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <DropdownItem key={index} eventKey={index.toString()}>
                <span style={{ color: 'black' }}>{item}</span>
              </DropdownItem>
            ))
          ) : (
            <DropdownItem key="none" disabled>No items available</DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
