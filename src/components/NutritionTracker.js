'use client';

import { useState } from 'react';

export default function NutritionTracker() {
  const [nutrition, setNutrition] = useState({
    calories: {
      consumed: 1800,
      goal: 2000
    },
    water: {
      consumed: 1.5,
      goal: 2.5
    },
    meals: []
  });

  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '' });

  const addWater = (amount) => {
    setNutrition(prev => ({
      ...prev,
      water: {
        ...prev.water,
        consumed: Math.min(prev.water.consumed + amount, prev.water.goal)
      }
    }));
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    const calories = parseInt(newMeal.calories);
    
    setNutrition(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        consumed: prev.calories.consumed + calories
      },
      meals: [...prev.meals, newMeal]
    }));

    setNewMeal({ name: '', calories: '' });
    setShowAddMeal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Nutrition Tracker</h2>
      
      {/* Calories Section */}
      <div className="space-y-4">
        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600">Daily Calories</p>
            <button 
              onClick={() => setShowAddMeal(true)}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Log Meal
            </button>
          </div>
          <div className="flex items-center">
            <p className="text-2xl font-bold">{nutrition.calories.consumed}</p>
            <p className="text-gray-500 ml-2">/ {nutrition.calories.goal} cal</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{width: `${(nutrition.calories.consumed / nutrition.calories.goal) * 100}%`}}
            />
          </div>
        </div>

        {/* Water Intake Section */}
        <div className="border-b pb-4">
          <p className="text-gray-600 mb-2">Water Intake</p>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <p className="text-2xl font-bold">{nutrition.water.consumed}L</p>
              <p className="text-gray-500 ml-2">/ {nutrition.water.goal}L</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => addWater(0.25)}
                className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
              >
                +250ml
              </button>
              <button 
                onClick={() => addWater(0.5)}
                className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
              >
                +500ml
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-400 h-2.5 rounded-full transition-all duration-300" 
              style={{width: `${(nutrition.water.consumed / nutrition.water.goal) * 100}%`}}
            />
          </div>
        </div>

        {/* Recent Meals List */}
        <div>
          <p className="text-gray-600 mb-2">Recent Meals</p>
          <div className="space-y-2">
            {nutrition.meals.slice(-3).map((meal, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{meal.name}</span>
                <span>{meal.calories} cal</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Log Meal</h3>
            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Meal Name</label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Calories</label>
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddMeal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 