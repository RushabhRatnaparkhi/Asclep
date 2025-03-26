import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  doctor: String,
  location: String,
  date: {
    type: Date,
    required: true
  },
  notes: String,
  reminderEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema); 