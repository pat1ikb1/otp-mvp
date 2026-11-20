import NumberFlow from '@number-flow/react';

interface MoneyFlowProps {
  value: number;
  className?: string;
  suffix?: string;
  decimals?: number;
}

export function MoneyFlow({
  value,
  className = '',
  suffix = ' Ft',
  decimals = 0,
}: MoneyFlowProps) {
  const displayVal = decimals === 0 ? Math.round(value) : value;
  return (
    <NumberFlow
      value={displayVal}
      locales="hu-HU"
      format={{
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }}
      suffix={suffix}
      className={`tabular-nums ${className}`}
    />
  );
}
