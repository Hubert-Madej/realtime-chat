import { chatHrefConstructor, cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";
import { Toast, toast } from "react-hot-toast";

interface NewMessageToastProps {
  t: Toast;
  sessionId: string;
  senderId: string;
  senderImage: string;
  senderName: string;
  senderMessage: string;
}

const NewMessageToast: FC<NewMessageToastProps> = ({
  t,
  sessionId,
  senderId,
  senderImage,
  senderName,
  senderMessage,
}) => {
  return (
    <div
      className={cn(
        "max-w-md w-full bg-white shadow-lg duration-200 rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5",
        {
          "animate-enter": t.visible,
          "animate-leave": !t.visible,
        }
      )}
    >
      <a
        className="flex-1 w-0 p-4"
        onClick={() => toast.dismiss(t.id)}
        href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="relative h-10 w-10">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={senderImage}
                alt={`${senderName} profile picture`}
              />
            </div>
          </div>

          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{senderName}</p>
            <p className="mt-1 text-sm text-gray-500 truncate w-1/2">
              {senderMessage}
            </p>
          </div>
        </div>
      </a>

      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-500 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NewMessageToast;
