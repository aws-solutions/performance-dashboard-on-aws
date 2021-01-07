import { useEffect, useState } from "react";
import Auth from "@aws-amplify/auth";

type AdminHook = {
  username: string;
};

export function useAdmin(): AdminHook {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const user = await Auth.currentAuthenticatedUser();
      setUsername(user.username);
    };
    fetchData();
  }, []);

  return {
    username,
  };
}
