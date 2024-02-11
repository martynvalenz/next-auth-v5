import { currentSession } from "@/actions/user/session";
import { UserInfo } from "@/components/auth/user-info";

const ServerPage = async() => {
  const user = await currentSession();
  return (
    <UserInfo user={user} label="🖥️ Server component" />
  );
}

export default ServerPage;
