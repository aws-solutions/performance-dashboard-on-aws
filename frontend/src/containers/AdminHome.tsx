import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import BadgerService from '../services/BadgerService';
import MainLayout from '../layouts/Main';
import PageHeader from '../components/PageHeader';

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
    <MainLayout>
      <PageHeader>
        <PageHeader.Title>Admin Portal</PageHeader.Title>
      </PageHeader>
      <p>Welcome to the admin portal <b>{user.username}</b></p>
      <p><b>Bearer Token</b> <code>{token}</code></p>
      <br />
      <AmplifySignOut />
    </MainLayout>
  );
}

export default AdminHome;
