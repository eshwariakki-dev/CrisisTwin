import React from "react";

function ResourceTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "hospital", label: "🏥 Hospitals" },
    { id: "shelter", label: "🏠 Emergency Shelters" },
    { id: "fire", label: "🚒 Fire Stations" },
    { id: "police", label: "👮 Police Stations" },
  ];

  return (
    <div className="resource-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? "tab active" : "tab"}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default ResourceTabs;