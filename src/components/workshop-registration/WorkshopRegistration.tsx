import { useRef, useState } from "react";
import RegistrationDialog, {
  type DialogResponse,
  type RegistrationDialogInterface,
} from "./RegistrationDialog";

export default function WorkshopRegistration() {
  const dialogRef = useRef<RegistrationDialogInterface>(null);
  const [status, setStatus] = useState<DialogResponse | null>(null);

  const onRegisterClick = () => {
    dialogRef?.current?.open();
  };

  const onRegistrationResponse = (response: DialogResponse) => {
    setStatus(response);
  };

  return (
    <div>
      <h1>Register to your favorite workshops!</h1>
      <button onClick={onRegisterClick}>Register</button>
      <RegistrationDialog ref={dialogRef} onResponse={onRegistrationResponse} />
      {status && <p>{status.message}</p>}
    </div>
  );
}
