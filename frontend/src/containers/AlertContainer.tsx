import React from "react";
import { useHistory } from "react-router-dom";
import { LocationState } from "../models";
import Alert from "../components/Alert";

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
      <Alert type={state.alert.type} message={state.alert.message} slim />
    </div>
  );
}

export default AlertContainer;
