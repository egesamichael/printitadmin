import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  item: {
    label: string;
    route?: string;
    children?: SidebarItemProps["item"][]; // recursive type
  };
  level?: number; // optional: for styling indentation
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, level = 0 }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Check if this item has children
  const hasChildren = item.children && item.children.length > 0;

  // Decide if current route is 'active'
  const isActiveRoute = item.route === pathname;

  // Toggle sub-menu when parent is clicked
  const handleToggle = () => {
    // Only toggle if there are children
    if (hasChildren) setIsOpen((prev) => !prev);
  };

  return (
    <li>
      {/* Parent Row */}
      {hasChildren ? (
        // If item has children, render a "button-like" div (not a Link) so it won't navigate
        <div
          onClick={handleToggle}
          className={`
            flex items-center justify-between
            px-4 py-2 cursor-pointer
            ${isActiveRoute ? "bg-gray-700 text-white" : "text-gray-300"}
            hover:bg-gray-600
            transition-colors
            ml-${level * 2} // Optional: indent for sub-level
          `}
        >
          <span>{item.label}</span>
          {/* Arrow icon, rotates if open */}
          <svg
            className={`h-4 w-4 transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 11l3.72-3.77a.75.75 0 011.08 1.04l-4.25 4.3a.75.75 0 01-1.08 0l-4.25-4.3a.75.75 0 01.02-1.06z" />
          </svg>
        </div>
      ) : (
        // If no children, just render a Link
        <Link
          href={item.route || "#"}
          className={`
            block px-4 py-2
            ${isActiveRoute ? "bg-gray-700 text-white" : "text-gray-300"}
            hover:bg-gray-600
            transition-colors
            ml-${level * 2} // Optional: indent for sub-level
          `}
        >
          {item.label}
        </Link>
      )}

      {/* Sub-menu */}
      {hasChildren && (
        <ul
          className={`
            overflow-hidden transition-all
            ${isOpen ? "max-h-[1000px]" : "max-h-0"} 
            bg-gray-800 // optional styling for sub-level
          `}
        >
          {item.children?.map((child, i) => (
            <SidebarItem key={i} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
