const Alert = ({ children, type = 'error' }) => {
  if (!children) {
    return null;
  }

  const styles = {
    error: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  }[type] ?? 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div role="alert" className={`mb-4 rounded-lg border px-3 py-2 text-sm ${styles}`}>
      {children}
    </div>
  );
};

export default Alert;
