import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import BadgerService from '../services/BadgerService';
import AdminLayout from '../layouts/Admin';
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
    <AdminLayout>
      <PageHeader>
        <PageHeader.Title>Admin Portal</PageHeader.Title>
      </PageHeader>
      <p>Welcome {user.username}</p>
      <p><b>Bearer Token</b> <code>{token}</code></p>
      <br />
      <AmplifySignOut />
    </AdminLayout>
  );
}

export default AdminHome;
