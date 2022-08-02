import SendMessageContainer from "./SendMessageContainer";
import ReceiveMessageContainer from "./ReceiveMessageContainer";

const renderChat = (receiverAddress, messages) => {
  const chatJSX = [];
  const receiverAddressLowerCase = receiverAddress.toLowerCase();
  const messageLog = messages[receiverAddress];

  if (messageLog == null) {
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
  console.log("chat >>>", chat)
  return (
    <>
      {chat}
    </>
  );
};

export default ChatBox;
