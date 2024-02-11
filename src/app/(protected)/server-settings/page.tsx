import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const SettingsPage = async() => {
  const session = await auth();
  
  return (
    <div>
      <div>{JSON.stringify(session)}</div>
      <form action={async() => {
        'use server'
        await signOut();
      }}>
        <Button type="submit">Sign out</Button> 
      </form>
    </div>
  );
}

export default SettingsPage;