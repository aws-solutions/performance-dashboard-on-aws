import React from "react";
import MarkdownRender from "../components/MarkdownRender";

const UserStatus = () => {
  return (
    <>
      <h1>User Statuses</h1>
      <p className="font-sans-lg">
        Users in the system have different statuses. These statuses are being
        pulled directly from AWS Cognito but we explain what they mean below.{" "}
        <a href="https://aws.amazon.com/cognito/" target="_blank">
          Learn about AWS Cognito.
        </a>
      </p>

      <h3 className="margin-top-5">UNCONFIRMED</h3>
      <p>
        This user has been created but not confirmed. They have not logged into
        the dashboard system. Check that you have the correct email and you can
        resend the invite email.
      </p>

      <h3 className="margin-top-5">CONFIRMED</h3>
      <p>
        This user has been confirmed and they have successfully logged in to the
        system.
      </p>

      <h3 className="margin-top-5">ARCHIVED</h3>
      <p>User is no longer active in the system.</p>

      <h3 className="margin-top-5">COMPROMISED</h3>
      <p>This user has been disabled due to a potential security threat.</p>

      <h3 className="margin-top-5">UNKNOWN</h3>
      <p>This user status is not known.</p>

      <h3 className="margin-top-5">RESET_REQUIRED</h3>
      <p>
        This user is confirmed, but when the user navigates to the system they
        must request a code and reset their password before they can sign in.
      </p>

      <h3 className="margin-top-5">FORCE_CHANGE_PASSWORD</h3>
      <p>
        The user is confirmed and the user can sign in using a temporary
        password, but during their first sign-in, the user must change their
        password to a new value before doing anything else.
      </p>
    </>
  );
};

export default UserStatus;
