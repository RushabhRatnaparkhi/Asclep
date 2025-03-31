import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  dosageTime: {
    type: String,
    required: true
  },
  reminders: {
    enabled: {
      type: Boolean,
      default: false
    },
    notificationTime: [{
      time: String,
      enabled: {
        type: Boolean,
        default: true
      }
    }],
    notificationMethod: {
      type: String,
      enum: ['push', 'email', 'both'],
      default: 'push'
    }
  },
  frequency: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  instructions: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'discontinued'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Medication = mongoose.models.Medication || mongoose.model('Medication', medicationSchema);
export default Medication;