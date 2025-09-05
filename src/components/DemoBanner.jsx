import React from "react";
import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

export const DemoBanner = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo?.isDemo) return null;
  return (
    <Alert variant="info" className="text-center mb-0">
      <p>
        You are logged in as a <strong>Demo User</strong>
      </p>
      <b>Actions are disabled</b>
    </Alert>
  );
};
