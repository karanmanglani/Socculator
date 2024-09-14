'use client';
import React, { useState, useEffect } from 'react';

export default function Droplist({ list = [], getvalue }) {
  const [selectedItem, setSelectedItem] = useState('Select an item');
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredItems, setFilteredItems] = useState(list); // State for filtered list
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Control dropdown visibility

  // Update filtered items when search term changes
  useEffect(() => {
    const filtered = list.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, list]);

  // Handle item selection
  const handleSelect = (item) => {
    setSelectedItem(item);
    getvalue(item);
    setIsDropdownOpen(false); // Close dropdown after selecting
  };

  return (
    <div className="relative w-full">
      {/* Input Field for Search */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)} // Open dropdown when input is focused
        className="w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300 transition duration-150 ease-in-out"
      />

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className="cursor-pointer p-2 hover:bg-cyan-100 text-gray-700"
              >
                {item}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No items found</li>
          )}
        </ul>
      )}

      {/* Button to display selected item */}
      <div className="mt-2">
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="w-full p-2 border rounded-lg shadow-sm bg-white hover:border-cyan-500 text-gray-700"
        >
          {selectedItem}
        </button>
      </div>
    </div>
  );
}
