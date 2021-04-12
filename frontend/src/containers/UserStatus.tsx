import React from "react";

const UserStatus = () => {
  return (
    <>
      <h1>User Statuses</h1>
      <div className="font-sans-lg usa-prose">
        <p>
          Users in the system have different statuses. These statuses are being
          pulled directly from AWS Cognito but we explain what they mean below.{" "}
          <a href="https://aws.amazon.com/cognito/" target="_blank">
            Learn about AWS Cognito.
          </a>
        </p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">UNCONFIRMED</h3>
      <div className="usa-prose">
        <p>
          This user has been created but not confirmed. They have not logged
          into the dashboard system. Check that you have the correct email and
          you can resend the invite email.
        </p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">CONFIRMED</h3>
      <div className="usa-prose">
        <p>
          This user has been confirmed and they have successfully logged in to
          the system.
        </p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">ARCHIVED</h3>
      <div className="usa-prose">
        <p>User is no longer active in the system.</p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">COMPROMISED</h3>
      <div className="usa-prose">
        <p>This user has been disabled due to a potential security threat.</p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">UNKNOWN</h3>
      <div className="usa-prose">
        <p>This user status is not known.</p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">RESET_REQUIRED</h3>
      <div className="usa-prose">
        <p>
          This user is confirmed, but when the user navigates to the system they
          must request a code and reset their password before they can sign in.
        </p>
      </div>

      <h3 className="margin-top-4 margin-bottom-1">FORCE_CHANGE_PASSWORD</h3>
      <div className="usa-prose">
        <p>
          The user is confirmed and the user can sign in using a temporary
          password, but during their first sign-in, the user must change their
          password to a new value before doing anything else.
        </p>
      </div>
    </>
  );
};

export default UserStatus;
