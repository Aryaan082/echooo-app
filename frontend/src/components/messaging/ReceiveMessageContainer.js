import moment from "moment";
import "../../styles/message.css";

const ReceiveMessageContainer = ({receiverAddress, message, timestamp}) => {
  console.log("time stamp >>>", timestamp)
  const messageTimestamp = moment.unix(timestamp).format("DD-MM-YYYY HH:mm");
  return (
    <div className="pl-3">
      <div className="flex flex-row gap-4">
        <div className="message-receiver">{message}</div>
      </div>
      <div className="pt-3 text-xs text-gray-500 italic">
        {`${receiverAddress.substring(0, 4)}...${receiverAddress.substring(
          38
        )}, ${messageTimestamp}`}
      </div>
    </div>
  );
};

export default ReceiveMessageContainer;
