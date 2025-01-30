import mongoose from 'mongoose';
import { type } from 'os';

const TicketSchema = new mongoose.Schema({
  ticketID: { type: String, required: true, unique: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  email: { type: String, required: true },
  ticketHeader: { type: String },
  status:  {type:String,default:'Sent',enum:['Sent','Opened','InProgress','Hold','Resolved','Canceled']},
  prediction: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  department:{type:String,default:'sru'}
});

const Ticket = mongoose.model('Ticket', TicketSchema);

export default Ticket;
