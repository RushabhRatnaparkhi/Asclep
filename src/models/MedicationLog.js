import mongoose from 'mongoose';

const MedicationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Medication'
  },
  status: {
    type: String,
    enum: ['taken', 'missed', 'skipped'],
    required: true
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  takenTime: Date,
  notes: String
}, {
  timestamps: true
});

export default mongoose.models.MedicationLog || mongoose.model('MedicationLog', MedicationLogSchema); 