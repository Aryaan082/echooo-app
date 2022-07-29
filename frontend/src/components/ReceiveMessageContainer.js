import moment from "moment";

const ReceiveMessageContainer = (receiverAddress, message, timestamp) => {
    const messageTimestamp = moment.unix(timestamp).format("DD-MM-YYYY HH:mm");
    return (
        <div className="pl-3">
            <div className="flex flex-row gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border-[2px] border-[rgba(241,245,249)]">{message}</div>
            </div>
            <div className="pt-3 text-xs text-gray-500 italic">
                {`${receiverAddress.substring(0, 4)}...${receiverAddress.substring(38)}, ${messageTimestamp}`}
            </div>
        </div>
    )
}

export default ReceiveMessageContainer;