import Navbar from "../components/NavigationBar";
import TicketHistory from "./OldTickets";
import TicketForm from "./TicketForm";

function TicketPage() {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center w-full px-4 mt-10 space-x-8">
        <div className="flex-grow max-w-2xl">
          <TicketHistory />
        </div>
        <div className="flex-grow max-w-lg">
          <TicketForm />
        </div>
      </div>
    </div>
  );
}

export default TicketPage;
