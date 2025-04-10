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
      default: true
    },
    notificationTime: [{
      time: String,
      enabled: {
        type: Boolean,
        default: true
      },
      lastNotified: Date
    }],
    notificationMethod: {
      type: String,
      enum: ['push', 'email', 'both'],
      default: 'push'
    }
  },
  frequency: {
    type: String,
    enum: [
      'once-daily',
      'twice-daily',
      'three-daily',
      'four-daily',
      'once-weekly',
      'twice-weekly',
      'three-weekly',
      'once-monthly',
      'twice-monthly',
      'as-needed',
      'every-other-day',
      'custom'
    ],
    required: true
  },
  customFrequency: {
    type: String,
    required: function() {
      return this.frequency === 'custom';
    }
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
  },
  nextDoseTime: {
    type: Date,
    required: true
  },
  prescriptionFile: {
    url: String,
    filename: String,
    contentType: String
  }
}, {
  timestamps: true
});

// Add index for querying upcoming medications
medicationSchema.index({ userId: 1, nextDoseTime: 1, status: 1 });

const Medication = mongoose.models.Medication || mongoose.model('Medication', medicationSchema);
export default Medication;