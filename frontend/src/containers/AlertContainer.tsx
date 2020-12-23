import React from "react";
import { useHistory } from "react-router-dom";
import { LocationState } from "../models";
import Alert from "../components/Alert";
import Link from "../components/Link";

interface Props {
  id?: string;
}

function AlertContainer(props: Props) {
  const history = useHistory<LocationState>();
  const { state } = history.location;

  if (!state || !state.alert || state.id !== props.id) {
    return null;
  }

  return (
    <div className="margin-y-2">
      <Alert
        type={state.alert.type}
        message={
          state.alert.linkLabel && state.alert.to ? (
            <div className="margin-left-4">
              {state.alert.message}{" "}
              <Link target="_blank" to={state.alert.to} external>
                {state.alert.linkLabel}
              </Link>
            </div>
          ) : (
            state.alert.message
          )
        }
        slim
      />
    </div>
  );
}

export default AlertContainer;
