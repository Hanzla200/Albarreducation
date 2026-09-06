interface SubmitButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function SubmitButton({ label, disabled, onClick }: SubmitButtonProps) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      disabled={disabled}
      onClick={onClick}
      className="btn"
    >
      {label}
    </button>
  );
}

