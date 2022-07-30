import moment from "moment";
import "../styles/message.css";

const SendMessageContainer = (message, timestamp) => {
  const messageTimestamp = moment.unix(timestamp).format("DD-MM-YYYY HH:mm");

  return (
    <div>
      <div className="pr-6">
        <div className="flex flex-row justify-end gap-4">
          <div className="message-sender">{message}</div>
        </div>
        <div className="flex flex-row justify-end gap-4 pt-3 text-xs text-gray-500 italic">
          {`You, ${messageTimestamp}`}
        </div>
      </div>
    </div>
  );
};

export default SendMessageContainer;
