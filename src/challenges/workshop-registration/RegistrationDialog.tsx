// Note: Handle submission
import { useImperativeHandle, useRef, type Ref } from "react";
import RegistrationForm, { type Values } from "./RegistrationForm";

export type DialogResponse = {
  ok: boolean;
  message: string;
  data: Values;
};

export type RegistrationDialogProps = {
  ref: Ref<RegistrationDialogInterface>;
  onResponse: (response: DialogResponse) => void;
};

export type RegistrationDialogInterface = {
  open: () => void;
  close: () => void;
};

export default function RegistrationDialog({
  ref,
  onResponse,
}: RegistrationDialogProps) {
  useImperativeHandle(ref, () => {
    return {
      open: () => dialogRef?.current?.showModal(),
      close: () => dialogRef?.current?.close(),
    };
  }, []);

  const onClose = () => {
    dialogRef?.current?.close();
  };

  const onSubmit = async (formData: Values) => {
    dialogRef?.current?.close();

    try {
      // We'd make the request and send the data here.
      const response = await new Promise<DialogResponse>((resolve, reject) => {
        // Simulate a delay between 1.25s and 1.75s.
        const requestDelay = 1250 + (Math.trunc(Math.random() * 1000) % 500);
        setTimeout(() => {
          const succeed = !!(Math.trunc(Math.random() * 10) % 2);
          return succeed
            ? resolve({
                ok: true,
                message: "You've been registered on the selected workshops.",
                data: formData,
              })
            : reject({
                ok: false,
                message: "There was a problem with your registration.",
                data: formData,
              });
        }, requestDelay);
      });

      formRef.current?.reset();
      onResponse(response);
    } catch (e) {
      onResponse(e as DialogResponse);
    }
  };

  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<{ reset: () => void }>(null);

  return (
    <dialog ref={dialogRef}>
      <RegistrationForm ref={formRef} onClose={onClose} onSubmit={onSubmit} />
    </dialog>
  );
}
