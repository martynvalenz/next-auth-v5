import { User } from "next-auth";
import { ExtendedUser } from "../../next-auth";
import { Card, CardContent, CardHeader } from "../ui/card";

interface Props {
  user:any;
  label:string;
}

export const UserInfo = ({ user,label }:Props) => {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-4">
          <img
            src={user.image}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-lg font-semibold">{user.email}</p>
            <p className="text-lg font-semibold">{user.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};