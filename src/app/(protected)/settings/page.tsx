'use client';
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser.hook";
import { signOut } from "next-auth/react";

const ServerSettingsPage = () => {
  const user = useCurrentUser();

  const singOutUser = () => {
    signOut();
  }
  
  return (
    <div className="bg-white p-10 rounded-xl">
      <Button type="submit" onClick={singOutUser}>Sign out</Button> 
    </div>
  );
}

export default ServerSettingsPage;