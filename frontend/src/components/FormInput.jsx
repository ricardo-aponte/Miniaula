const FormInput = ({ label, id, error, ...inputProps }) => (
  <div className="mb-4">
    <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
      {label}
    </label>
    <input
      id={id}
      aria-invalid={Boolean(error)}
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
        error ? 'border-red-500' : 'border-slate-300'
      }`}
      {...inputProps}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default FormInput;
