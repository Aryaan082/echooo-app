import SendMessageContainer from "./SendMessageContainer";
import ReceiveMessageContainer from "./ReceiveMessageContainer";

const renderChat = (receiverAddress, messages) => {
  const chatJSX = [];
  const receiverAddressLowerCase = receiverAddress.toLowerCase();
  const messageLog = messages[receiverAddress];
  console.log("message log render chat >>>", messageLog)
  console.log("message log render chat address >>>", receiverAddress)
  if (messageLog == null || messageLog.length === 0) {
    return [];
  }
  
  for (let idx = 0; idx < messageLog.length; idx++) {
      let messageMetaData = messageLog[idx];
      if (receiverAddressLowerCase === messageMetaData.from) {
          chatJSX.push(<ReceiveMessageContainer receiverAddress={receiverAddressLowerCase} message={messageMetaData.message} timestamp={messageMetaData.timestamp} key={idx}/>)
      } else {
          chatJSX.push(<SendMessageContainer message={messageMetaData.message} timestamp={messageMetaData.timestamp} key={idx}/>)
      }
  }
  return chatJSX;
}
const ChatBox = ({ receiverAddress, messages, setMessageLog }) => {
  const chat = renderChat(receiverAddress, messages);
  return (
    <>
      {chat}
    </>
  );
};

export default ChatBox;
