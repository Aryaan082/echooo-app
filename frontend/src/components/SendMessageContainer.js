import moment from "moment";

const SendMessageContainer = (message, timestamp) => {
  const messageTimestamp = moment.unix(timestamp).format("DD-MM-YYYY HH:mm");

  return (
    <div>
      <div className="pr-6">
        <div className="flex flex-row justify-end gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border-[2px] border-[rgba(241,245,249)]">
            {message}
          </div>
        </div>
        <div className="flex flex-row justify-end gap-4 pt-3 text-xs text-gray-500 italic">
          {`You, ${messageTimestamp}`}
        </div>
      </div>
    </div>
  );
};

export default SendMessageContainer;
