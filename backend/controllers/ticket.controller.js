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
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.userId;

    if (!text || !email || !userID) {
      return res.status(400).json({ success: false, message: "Text, email, and userID are required" });
    }

    const ticketID = generateTicketID();

    const pythonProcess = spawn("python", ["ml/predict.py", text]);

    let output = "";
    let errorOccurred = false;

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString().trim();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
      errorOccurred = true;
    });

    pythonProcess.on("close", async (code) => {

      if (errorOccurred || !output) {
        return res.status(500).json({ success: false, message: "Prediction failed, no response from Python" });
      }

      try {
        const predictionResult = JSON.parse(output);

        if (!predictionResult.priority || !predictionResult.department) {
          return res.status(500).json({ success: false, message: "Invalid prediction response" });
        }

        const predictionText = predictionResult.priority;

        const newTicket = new Ticket({
          ticketID,  
          userID,
          text,
          email,
          ticketHeader,
          priority: predictionResult.priority,
          department: predictionResult.department,
          prediction: predictionText, 
        });

        await newTicket.save();

        return res.status(200).json({
          success: true,
          message: "Prediction successful, ticket saved",
          ticket: newTicket,
        });
      } catch (error) {
        console.error("JSON Parsing Error:", error);
        return res.status(500).json({ success: false, message: "Failed to parse prediction JSON" });
      }
    });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
  export const getAllTickets = async (req, res) => {
    try {
      // Fetch all tickets from the database
      const tickets = await Ticket.find();
  
      // Check if tickets exist
      if (!tickets || tickets.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No tickets found.',
        });
      }
      const formattedTickets = tickets.map((ticket) => ({
        _id: ticket._id,
        title: ticket.ticketID,
        description: ticket.text,
      }));
      // Return success response with tickets
      return res.status(200).json({
        success: true,
        tickets:formattedTickets,
      });
    } catch (error) {
      // Log error to console
      console.error('Error fetching tickets:', error);
  
      // Return server error response
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };
  export const deleteTicket = async (req, res) => {
    try {
      await Ticket.findByIdAndDelete(req.params.id);
      return  res.json({ message: "Ticket deleted" });
  } catch (error) {
      res.status(400).json({ message:error.message});
  }
  };
  export const updateTicket = async (req, res) => {
    try {
      const { _id } = req.body;

      const ticket = await Ticket.findById(_id);

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
            }
      ticket.status = "Opened";
      await ticket.save();
  
      return res.json({ message: "Ticket status updated to 'opened'", ticket });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  export const getCounts=async (req,res)=>{
    try{
    const token = req.cookies.token;
	  if (!token) {
		return res.status(401).json({ success: false, message: 'Unauthorized - no token provided' });
	  }

	  const decoded = jwt.verify(token, process.env.JWT_SECRET);
	const userId=decoded.userId;
  

	  const tickets = await Ticket.find({ userID: userId });

	  if (!tickets || tickets.length === 0) {
		return res.status(404).json({ success: false, message: 'No tickets found for this user' });
	  }
    const completed = tickets.filter(ticket => ticket.status === "Resolved").length;
    const pending = tickets.filter(ticket => 
      ticket.status === "Sent" || 
      ticket.status === "Opened" || 
      ticket.status === "InProgress" || 
      ticket.status === "Hold"
    ).length;
    const rejected = tickets.filter(ticket => ticket.status === "Canceled").length;
    
    return res.status(200).json({
      success: true,
      completed,
      pending,
      rejected
    });
  } catch (error) {
    console.error("Error in getCounts:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  }