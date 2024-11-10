import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000";

axios.defaults.withCredentials = true;

export const useTicketStore = create((set) => ({
	priority: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	predict: async (text,email,ticketHeader) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/ticket/predict`, { text, email ,ticketHeader});
			set({ priority: response.data.prediction, isAuthenticated: true, isLoading: false });
			console.log(response.data.prediction);
		} catch (error) {
			set({ error: error.response.data.message || "Error Predict Priority ", isLoading: false });
			throw error;
		}
	},
	

}));