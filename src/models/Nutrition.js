import mongoose from 'mongoose';

const NutritionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  calories: {
    consumed: { type: Number, default: 0 },
    goal: { type: Number, default: 2000 }
  },
  water: {
    consumed: { type: Number, default: 0 },
    goal: { type: Number, default: 2.5 }
  },
  meals: [{
    name: String,
    calories: Number,
    time: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.models.Nutrition || mongoose.model('Nutrition', NutritionSchema); 