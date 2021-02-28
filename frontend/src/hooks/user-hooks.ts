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

    // did the user do Single Sign In, if so we'll have to do Single Sign Out
    // attributes: {identities:"[{"providerType":"SAML"}]"}
    if (user.attributes && user.attributes["identities"]) {
      const identity = JSON.parse(user.attributes.identities);
      if (Array.isArray(identity) && identity[0].providerType) {
        setFederated(true);
      }
    } else {
      setFederated(false);
    }

    if (user.attributes && user.attributes["custom:roles"]) {
      const userRoles = user.attributes["custom:roles"];
      setRoles({
        isAdmin: userRoles.includes(UserRoles.Admin),
        isEditor: userRoles.includes(UserRoles.Editor),
        isPublisher: userRoles.includes(UserRoles.Publisher),
      });
    }
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
