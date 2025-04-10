import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);