import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'application/pdf']
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'discontinued'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add index for querying user prescriptions
prescriptionSchema.index({ userId: 1, status: 1 });

const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
export default Prescription;