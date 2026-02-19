import React from 'react';

const CATEGORY_COLORS = [
  'bg-green-100', 'bg-orange-100', 'bg-purple-100', 'bg-blue-100',
  'bg-pink-100', 'bg-yellow-100', 'bg-teal-100', 'bg-red-100'
];

const CATEGORY_EMOJIS = {
  rice: '🌾', flour: '🌾', frozen: '❄️', drinks: '🥤', spices: '🌶️',
  vegetables: '🥦', fruits: '🍊', meat: '🥩', fish: '🐟', dairy: '🥛',
  snacks: '🍿', bakery: '🍞', oils: '🫙', condiments: '🫙', household: '🏠',
  beauty: '✨', fashion: '👗', fabric: '🧵'
};

function getCategoryEmoji(name = '') {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '🛒';
}

function CategoryIcon({ cat, index, isSelected }) {
  const bgClass = isSelected ? 'bg-green-600 shadow-lg scale-105' : (cat.bg_color || CATEGORY_COLORS[index % CATEGORY_COLORS.length]);

  return (
    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all overflow-hidden ${bgClass}`}>
      {cat.icon_url
        ? <img src={cat.icon_url} alt={cat.name} className="w-full h-full object-cover rounded-full" />
        : getCategoryEmoji(cat.name)
      }
    </div>
  );
}

export default function CategoryRow({ categories, selectedCategory, onSelect }) {
  const activeCategories = categories.filter(c => c.is_active);

  return (
    <div className="px-4 md:px-6 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">Shop by Category</h2>
        <button onClick={() => onSelect('all')} className="text-sm text-green-700 font-medium hover:underline">
          Show All
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => onSelect('all')} className="flex flex-col items-center flex-shrink-0 gap-1.5">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${selectedCategory === 'all' ? 'bg-green-600 shadow-lg scale-105' : 'bg-gray-100'}`}>
            🛒
          </div>
          <span className={`text-xs font-medium text-center w-16 leading-tight ${selectedCategory === 'all' ? 'text-green-700' : 'text-gray-600'}`}>All</span>
        </button>

        {activeCategories.map((cat, i) => (
          <button key={cat.id} onClick={() => onSelect(cat.id)} className="flex flex-col items-center flex-shrink-0 gap-1.5">
            <CategoryIcon cat={cat} index={i} isSelected={selectedCategory === cat.id} />
            <span className={`text-xs font-medium text-center w-16 leading-tight ${selectedCategory === cat.id ? 'text-green-700' : 'text-gray-600'}`}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}