import SendMessageContainer from "./SendMessageContainer";
import ReceiveMessageContainer from "./ReceiveMessageContainer";

const ChatBox = ({ receiverAddress, messages, setMessages }) => {
    // TODO: replace hardcoded data with dynamic data from messages metadata
    console.log("receiver address >>>", receiverAddress)
    return (
        <>
            {/* Reciever */}
            <div className="w-full" style={{ height: "calc(5vh - 100px}" }}>
                <div className="flex justify-center align-center">
                    <div className="shadow-md flex flex-wrap rounded-[10px] border-[1px] p-5 bg-[rgba(241,245,249,0.5)] text-center text-md break-words">
                        {receiverAddress}
                    </div>
                </div>
            </div>

            {/* Chat box */}
            <div className="w-full overflow-scroll pt-4" style={{ height: "calc(82.5vh - 100px)" }}>
                {/* Sender */}
                {SendMessageContainer("hello sender", 1658733755)}
                {/* Reciever */}
                {ReceiveMessageContainer(receiverAddress, "hello receiver", 1658733755)}
            </div>
        </>
    )
}

export default ChatBox;