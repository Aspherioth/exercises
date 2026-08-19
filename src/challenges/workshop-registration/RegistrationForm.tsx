import {
  type Ref,
  useImperativeHandle,
  useState,
  type SubmitEventHandler,
} from "react";
import styles from "./RegistrationForm.module.css";

type RegistrationFormProps = {
  ref: Ref<{ reset: () => void }>;
  onClose: () => void;
  onSubmit: (formData: Values) => void;
};

export type Values = {
  name: string;
  email: string;
  country: string;
  ticketType: TicketType | "";
  workshops: string[];
  diet: string;
  conductAccepted: boolean;
};

type Field = keyof Values;

type Errors = Partial<Record<Field, string>>;

export type TicketType = "standard" | "student" | "vip";

const TICKET_TYPES: TicketType[] = ["standard", "student", "vip"];

const STEP_FIELDS: Field[][] = [
  ["name", "email", "country", "ticketType"],
  ["workshops", "conductAccepted"],
];

const validators: Partial<Record<Field, (v: Values) => string | undefined>> = {
  name: (v) => (v.name.trim() ? undefined : "Please insert your full name"),
  email: (v) => {
    if (!v.email) {
      return "Please insert your email";
    }

    if (!v.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return "Please insert a valid email";
    }

    return undefined;
  },
  country: (v) => (v.country ? undefined : "Please select your country"),
  ticketType: (v) =>
    v.ticketType ? undefined : "Please select the ticket type",
  workshops: (v) =>
    v.workshops.length ? undefined : "Please select at least 1 workshop",
  conductAccepted: (v) =>
    v.conductAccepted ? undefined : "You must agree to the Code of Conduct",
};

const DEFAULT_VALUES: Values = {
  name: "",
  email: "",
  country: "",
  ticketType: "",
  workshops: [],
  diet: "",
  conductAccepted: false,
};

const WORKSHOPS: Record<string, string> = {
  woodworking: "Creating Wood Furniture",
  baking: "Pastries 101",
  cooking: "Cooking Essentials",
  teaching1: "Lecture Prep - Part 1",
  teaching2: "Lecture Prep - Part 2",
  cleaning: "Keeping a Spotless Household",
};

export default function RegistrationForm({
  ref,
  onClose,
  onSubmit,
}: RegistrationFormProps) {
  const [step, setStep] = useState<number>(1);
  const [values, setValues] = useState<Values>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const onValueChanged = <K extends Field>(field: K, value: Values[K]) => {
    setValues((old) => ({ ...old, [field]: value }));
  };

  const validateFields = (fields: Field[]) => {
    const newErrors: Errors = {};
    fields.forEach((field) => {
      newErrors[field] = validators[field]?.(values);
    });

    setErrors((old) => ({ ...old, ...newErrors }));

    return Object.values(newErrors).some(Boolean);
  };

  const prevStep = () => {
    setStep((prev) => {
      if (prev > 1) return prev - 1;

      onClose();
      return prev;
    });
  };

  const resetForm = () => {
    setStep(1);
    setErrors({});
    setValues(DEFAULT_VALUES);
  };

  const toggleWorkshop = (workshop: string) => {
    setValues((old) => ({
      ...old,
      workshops: old.workshops.includes(workshop)
        ? old.workshops.filter((w) => w !== workshop)
        : [...old.workshops, workshop],
    }));
  };

  const onSubmitHandle: SubmitEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();

    if (validateFields(STEP_FIELDS[step - 1])) return;
    if (step === 1) {
      setStep(2);
      return;
    }
    onSubmit(values);
  };

  useImperativeHandle(ref, () => {
    return {
      reset: resetForm,
    };
  }, []);

  return (
    <form className={styles["form"]} onSubmit={onSubmitHandle} noValidate>
      {step === 1 && (
        <>
          <div className={styles["field"]}>
            <div className={styles["field-description"]}>
              <label htmlFor="name">Full Name*</label>
              {errors.name && (
                <span className={styles["error"]} id="error-name">
                  {errors.name}
                </span>
              )}
            </div>
            <input
              type="text"
              id="name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => onValueChanged("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "error-name" : undefined}
              required
            />
          </div>

          <div className={styles["field"]}>
            <div className={styles["field-description"]}>
              <label htmlFor="email">Email*</label>
              {errors.email && (
                <span className={styles["error"]} id="error-email">
                  {errors.email}
                </span>
              )}
            </div>

            <input
              type="text"
              id="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => onValueChanged("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-email" : undefined}
              required
            />
          </div>

          <div className={styles["field"]}>
            <div className={styles["field-description"]}>
              <label className={styles["field"]} htmlFor="country">
                Country*
              </label>
              {errors.country && (
                <span className={styles["error"]} id="error-country">
                  {errors.country}
                </span>
              )}
            </div>
            <select
              name="country"
              id="country"
              value={values.country}
              onChange={(e) => onValueChanged("country", e.target.value)}
              aria-invalid={!!errors.country}
              aria-describedby={errors.country ? "error-country" : undefined}
              required
            >
              <option value="">Select your country</option>
              <option value="US">USA</option>
              <option value="UK">England</option>
              <option value="PT">Portugal</option>
              <option value="FR">France</option>
            </select>
          </div>

          <fieldset
            aria-describedby={
              errors.ticketType ? "error-ticketType" : undefined
            }
            role="radiogroup"
          >
            <legend>Ticket Type*</legend>
            {errors.ticketType && (
              <span className={styles["error"]} id="error-ticketType">
                {errors.ticketType}
              </span>
            )}
            <ul className={styles["tickets"]}>
              {TICKET_TYPES.map((type) => (
                <li key={type}>
                  <input
                    type="radio"
                    name="ticketType"
                    id={type}
                    value={type}
                    checked={values.ticketType === type}
                    onChange={() => onValueChanged("ticketType", type)}
                    required
                  />
                  <label htmlFor={type}>{type}</label>
                </li>
              ))}
            </ul>
          </fieldset>
        </>
      )}

      {step === 2 && (
        <>
          <fieldset
            aria-describedby={errors.workshops ? "error-workshops" : undefined}
          >
            <legend>Workshops*</legend>
            {errors.workshops && (
              <span className={styles["error"]} id="error-workshops">
                {errors.workshops}
              </span>
            )}
            <ul className={styles["workshops"]}>
              {Array.from(Object.keys(WORKSHOPS)).map((workshop) => (
                <li key={workshop}>
                  <input
                    type="checkbox"
                    name="workshops"
                    id={workshop}
                    checked={values.workshops.includes(workshop)}
                    onChange={() => toggleWorkshop(workshop)}
                    required
                  />
                  <label htmlFor={workshop}>{WORKSHOPS[workshop]}</label>
                </li>
              ))}
            </ul>
          </fieldset>

          <label className={styles["field"]} htmlFor="diet">
            Dietary Requirements{" "}
            <textarea
              name="diet"
              id="diet"
              value={values.diet}
              onChange={(e) => onValueChanged("diet", e.target.value)}
            />
          </label>

          <div>
            <label htmlFor="conduct">
              <input
                type="checkbox"
                name="conduct"
                id="conduct"
                checked={values.conductAccepted}
                onChange={(e) =>
                  onValueChanged("conductAccepted", e.target.checked)
                }
                aria-invalid={!!errors.conductAccepted}
                aria-describedby={
                  errors.conductAccepted ? "error-conduct" : undefined
                }
              />
              *I acknowledge I've read and accept the terms in the{" "}
              <b>Code of Conduct</b>.
            </label>
            {errors.conductAccepted && (
              <p className={styles["error"]} id="error-conduct">
                {errors.conductAccepted}
              </p>
            )}
          </div>
        </>
      )}

      <div className={styles["buttons"]}>
        <button type="submit">{step === 1 ? "Next" : "Submit"}</button>
        <button type="button" onClick={prevStep}>
          {step === 1 ? "Close" : "Back"}
        </button>
      </div>
    </form>
  );
}
