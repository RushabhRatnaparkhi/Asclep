import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['MEDICATION_TAKEN', 'MEDICATION_ADDED', 'MEDICATION_UPDATED', 'PRESCRIPTION_UPLOADED']
  },
  description: {
    type: String,
    required: true
  },
  medicationId: String,
  prescriptionId: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Activity || mongoose.model('Activity', activitySchema);