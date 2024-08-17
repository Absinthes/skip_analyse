export type SvgIconProps = {
  name: string;
  prefix?: string;
  color?: string;
  className?: string;
} & Record<string, any>;

export default function SvgIcon({
  name,
  prefix = "icon",
  className = "",
  ...props
}: SvgIconProps) {
  const symbolId = `#${prefix}-${name}`;

  return (
    <svg className={`svg-icon ${className}`} {...props} aria-hidden="true">
      <use href={symbolId} />
    </svg>
  );
}
