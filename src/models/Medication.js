import mongoose from 'mongoose';

const MedicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  timeOfDay: [{
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night']
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  notes: String,
  remainingPills: Number,
  reminderEnabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Medication || mongoose.model('Medication', MedicationSchema); 