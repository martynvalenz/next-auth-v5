'use client';

import { FaUser } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser.hook";
import LogoutButton from "./logout-button";
import { MdExitToApp } from "react-icons/md";

const UserButton = () => {
  const user = useCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image ? user?.image : 'https://avatars.githubusercontent.com/u/139426'} alt={user?.name} />
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuItem>
          {user?.name}
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem>
            <MdExitToApp className="h-5 w-5 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton