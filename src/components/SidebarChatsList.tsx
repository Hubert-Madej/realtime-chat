'use client'

import { chatHrefConstructor } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface SidebarChatsListProps {
  sessionId: string,
  friends: User[] 
}

const SidebarChatsList: FC<SidebarChatsListProps> = ({sessionId, friends}) => {
  const router = useRouter();
  const pathName = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  useEffect(() => {
    if(pathName?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((message) => !pathName.includes(message.senderId));
      })
    }
  }, [pathName]);

  return <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
    {friends.sort().map((friend) => {
      const unseenMessagesCount = unseenMessages.filter((unseenMessage) => {
        return unseenMessage.senderId === friend.id;
      }).length;

      return <li key={friend.id}>
        <a className='text-gray-700 hover:text-blue-40 duration-200 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold' href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}>
          {friend.name}
          {unseenMessagesCount > 0 && (
            <div className='bg-blue-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
              {unseenMessagesCount}
            </div>
          )}
          </a>
      </li>
    })}
  </ul>
}
 
export default SidebarChatsList