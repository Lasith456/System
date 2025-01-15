import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import Ticket from '../models/ticket.model.js';
import jwt from "jsonwebtoken";
const generateTicketID = () => {
  return `TICKET-${Date.now()}-${uuidv4()}`;
};

export const predictPriority = async (req, res) => {
  try {
    const { text, email, ticketHeader } = req.body;
    const ticketID = generateTicketID();
	const token= req.cookies.token;
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	const userID=decoded.userId;
    if (!text || !email || !userID) {
      return res.status(400).json({ success: false, message: 'Text, email, and userID are required' });
    }

    const pythonProcess = spawn('python', ['ml/predict.py', text]);

    let prediction = '';
    let errorOccurred = false;

    pythonProcess.stdout.on('data', (data) => {
      prediction += data.toString().trim();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
      errorOccurred = true;
    });

    pythonProcess.on('close', async (code) => {
      if (errorOccurred) {
        return res.status(500).json({ success: false, message: 'Error during prediction' });
      }

      // Save the ticket to the database
      try {
        const newTicket = new Ticket({
          ticketID,
          userID,
          text,
          email,
          ticketHeader,
          prediction,
        });

        await newTicket.save();

        return res.status(200).json({
          success: true,
          message: 'Prediction successful, ticket saved',
          ticket: newTicket,
        });
      } catch (dbError) {
        console.error('Database save error:', dbError);
        return res.status(500).json({ success: false, message: 'Error saving ticket to database' });
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const getUserTickets = async (req, res) => {
	try {
	  const token = req.cookies.token;
	  if (!token) {
		return res.status(401).json({ success: false, message: 'Unauthorized - no token provided' });
	  }

	  const decoded = jwt.verify(token, process.env.JWT_SECRET);
	const userId=decoded.userId;
  
	  // Fetch tickets from the database
	  
	  const tickets = await Ticket.find({ userID: userId });

	  if (!tickets || tickets.length === 0) {
		return res.status(404).json({ success: false, message: 'No tickets found for this user' });
	  }

	  return res.status(200).json({
		success: true,
		tickets,
	  });
	} catch (error) {
	  console.error('Error fetching user tickets:', error);
	  return res.status(500).json({ success: false, message: 'Server error' });
	}
  };