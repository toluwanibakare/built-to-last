export function Field({ label, id, error, hint, className = '', as, children, ...rest }) {
  const errorId = error ? `${id}-error` : undefined
  const Tag = as || 'input'

  const inputClasses = `w-full rounded-lg border bg-white px-4 py-3 text-base text-ink transition-all duration-300 placeholder:text-mist focus:border-brass focus:ring-2 focus:ring-brass/20 focus:outline-none ${
    error ? 'border-red-400 bg-red-50/50' : 'border-line'
  }`

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
        {rest.required ? <span className="text-brass-deep" aria-hidden="true"> *</span> : null}
      </label>
      <Tag
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={inputClasses}
        {...rest}
      >
        {children}
      </Tag>
      {error ? (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-mist">{hint}</p>
      ) : null}
    </div>
  )
}