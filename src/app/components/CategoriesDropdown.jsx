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
  return (
    <div
      className="absolute top-full left-0 bg-white shadow-lg rounded-lg 
                 p-8 grid grid-cols-5 gap-6 z-50 mt-2 
                 w-[1058px] h-[448px] overflow-y-auto"
    >
      {Object.entries(categoriesData).map(([section, items]) => (
        <div key={section}>
          <h3 className="font-bold mb-3 text-lg">{section}</h3>
          <ul className="space-y-2">
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
