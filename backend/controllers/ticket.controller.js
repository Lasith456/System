import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
const generateTicketID = () => {
	return `TICKET-${Date.now()}-${uuidv4()}`;
  };
export const predictPriority =async (req,res)=>{

    try {
        const {text,email,ticketHeader} = req.body;
		const ticketID = generateTicketID(); 
	if (!text) {
	  return res.status(400).send('Text input is required');
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
  
	pythonProcess.on('close', (code) => {
	  if (errorOccurred) {
		return res.status(500).send('Error during prediction');
	  }
	  return res.status(200).json({
        success:true,
        prediction,
    });
	});    
    

} catch (error) {
    res.status(400).json({success:false,message:error.message});
}
}