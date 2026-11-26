const VARIANTS = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800',
};

const Button = ({ variant = 'primary', className = '', type = 'button', children, ...props }) => (
  <button
    type={type}
    className={`w-full cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
      VARIANTS[variant] ?? VARIANTS.primary
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
