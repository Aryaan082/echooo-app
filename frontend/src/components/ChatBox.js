import SendMessageContainer from "./SendMessageContainer";
import ReceiveMessageContainer from "./ReceiveMessageContainer";

const ChatBox = ({ receiverAddress, messages, setMessages }) => {
  // TODO: replace hardcoded data with dynamic data from messages metadata
  console.log("receiver address >>>", receiverAddress);
  return (
    <>
      {/* Chat box */}
      {/* Sender */}
      {SendMessageContainer("hello sender", 1658733755)}
      {/* Reciever */}
      {ReceiveMessageContainer(receiverAddress, "hello receiver", 1658733755)}
    </>
  );
};

export default ChatBox;
