'use client';
import React, { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input } from "@nextui-org/react";

export default function Droplist({ list = [], getvalue }) {
  const [selectedItem, setSelectedItem] = useState("Select an item");
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
    <div className="flex items-center space-x-4">
      {/* Search input outside the dropdown */}
      <div className="flex-shrink-0">
        <Input
          clearable
          placeholder="Search..."
          onChange={handleSearch}
          value={searchTerm}
          autoFocus
          className="w-full border rounded-lg shadow-sm focus:ring focus:ring-cyan-300 transition duration-150 ease-in-out"
          style={{ fontWeight: '600', fontSize: '16px' }}
        />
      </div>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered" className="border-gray-300 hover:border-cyan-500 text-gray-700">
            {selectedItem} {/* Show the selected item on the button */}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dynamic Actions"
          onAction={(key) => handleSelect(key)}
          className="w-48"
        >
          {/* Map over the filtered list */}
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <DropdownItem key={index} eventKey={index.toString()} className="text-black">
                {item}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem key="none" disabled className="text-gray-500">
              No items available
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
