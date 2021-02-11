import { useEffect, useState, useCallback } from "react";
import Auth from "@aws-amplify/auth";
import { User, UserRoles } from "../models";
import BackendService from "../services/BackendService";

type CurrentUserHook = {
  username: string;
  isAdmin: boolean;
  isEditor: boolean;
  isPublisher: boolean;
  isFederatedId: boolean;
};

function getRoleFromUser(user: any): string {

  let roles = "";

  if (user.attributes && user.attributes["custom:roles"])
    roles = user.attributes["custom:roles"] + " ";
  
  if (user.signInUserSession && user.signInUserSession.idToken && user.signInUserSession.idToken.payload && user.signInUserSession.idToken.payload["custom:roles"])
    roles = roles + user.signInUserSession.idToken.payload["custom:roles"];

  return roles;
}

export function useCurrentAuthenticatedUser(): CurrentUserHook {
  const [username, setUser] = useState<string>("");
  const [federated, setFederated] = useState(false);
  const [roles, setRoles] = useState<{
    isAdmin: boolean;
    isEditor: boolean;
    isPublisher: boolean;
  }>({
    isAdmin: false,
    isEditor: false,
    isPublisher: false,
  });

  const fetchData = useCallback(async () => {
    const user = await Auth.currentAuthenticatedUser();
    
    setUser(user.username);
    setFederated(!(user.attributes && user.attributes["custom:roles"]));

    const userRoles = getRoleFromUser(user);
    setRoles({
      isAdmin: userRoles.includes(UserRoles.Admin),
      isEditor: userRoles.includes(UserRoles.Editor),
      isPublisher: userRoles.includes(UserRoles.Publisher),
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    username,
    isAdmin: roles.isAdmin,
    isFederatedId: federated,
    isEditor: roles.isEditor,
    isPublisher: roles.isPublisher,
  };
}

type UsersHook = {
  users: User[];
  loading: boolean;
  reloadUsers: Function;
  setUsers: Function;
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
    setUsers,
  };
}
