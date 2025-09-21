import React from "react";

const categoriesData = {
  Construction: ["Contractors", "Plumbers", "Electricians", "Painters", "POP Designers"],
  Mechanics: ["Bike Mechanics", "Car Mechanics", "Auto Mechanics", "Truck Mechanics"],
  Household: ["Cleaners", "Cooks", "Maids", "Caretakers", "Drivers"],
  PersonalCare: ["Barbers", "Beauticians", "Tailors", "Laundry Services"],
  Agriculture: ["Farm Helpers", "Machine Operators", "Irrigation Workers"],
  Logistics: ["Delivery Boys", "Packers & Movers", "Helpers", "Loaders"],
  Others: ["Welders", "Carpenters", "Security Guards", "Watchmen"],
};

const CategoriesDropdown = () => {
  const sectionCount = Object.keys(categoriesData).length; // 8 sections

  return (
    <div
    className="absolute top-full left-0 bg-white shadow-lg border rounded-none p-6 grid grid-cols-5 gap-1 z-50 mt-2"
    style={{ width: '800px' }}
  >
  
      {Object.entries(categoriesData).map(([section, items]) => (
        <div key={section}>
          <h3 className="font-bold mb-2">{section}</h3>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item} className="hover:underline cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CategoriesDropdown;
