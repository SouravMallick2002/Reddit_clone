import React from "react";
import styles from "./Alert.module.css";

interface AlertProps {
  Alert: {
    Messages: string;
    Types: "success" | "danger" | "warning" | "info";
  } | null;
}

const Alert: React.FC<AlertProps> = (props) => {
  const capitalize = (word: string): string => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    props.Alert && (
      <div
        className={`${styles.alert} ${styles[`alert-${props.Alert.Types}`]} ${styles["alert-dismissible"]}`}
        role="alert"
      >
        <strong>{capitalize(props.Alert.Messages)}</strong>
      </div>
    )
  );
};

export default Alert;
