import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
  },
  medication: {
    type: String,
    required: function() {
      return !this.imageUrl; // Only required if no image
    }
  },
  dosage: {
    type: String,
    required: function() {
      return !this.imageUrl; // Only required if no image
    }
  },
  frequency: {
    type: String,
    required: function() {
      return !this.imageUrl; // Only required if no image
    }
  },
  startDate: {
    type: Date,
    required: function() {
      return !this.imageUrl; // Only required if no image
    }
  },
  endDate: Date,
  instructions: String,
  prescribedBy: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'discontinued'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add a pre-save validation
prescriptionSchema.pre('save', function(next) {
  if (!this.imageUrl && (!this.medication || !this.dosage || !this.frequency || !this.startDate)) {
    next(new Error('Either image or prescription details are required'));
  }
  next();
});

const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
export default Prescription;