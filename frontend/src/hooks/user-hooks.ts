import { useEffect, useState, useCallback } from "react";
import Auth from "@aws-amplify/auth";
import { User } from "../models";
import BackendService from "../services/BackendService";

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

type UsersHook = {
  users: User[];
  loading: boolean;
  reloadUsers: Function;
};

export function useUsers(): UsersHook {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await BackendService.fetchUsers();
    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    users,
    reloadUsers: fetchData,
  };
}
