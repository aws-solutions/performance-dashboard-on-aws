import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import BadgerService from '../../services/badger-service';
import HomepageLayout from '../../layouts/Homepage';

type User = {
  username: string,
};

function AdminHome() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  useEffect(() => {
    async function fetchUser() {
      const session = await Auth.currentAuthenticatedUser();
      const token = await BadgerService.getAuthToken();
      setUser(session);
      setToken(token);
    }
    fetchUser();
  }, []);

  if(user === null) {
    return (<p>Who are you?</p>)
  }

  return (
    <HomepageLayout title="Admin Portal">
      <p>Welcome to the admin portal <b>{user.username}</b></p>
      <p><b>Bearer Token</b> <code>{token}</code></p>
      <br />
      <AmplifySignOut />
    </HomepageLayout>
  );
}

export default AdminHome;
