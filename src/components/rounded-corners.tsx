export default function RoundedCorners() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="invisible absolute size-0"
    >
      <defs>
        <filter id="flt_tag">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 12 -5"
            result="flt_tag"
          />
          <feComposite in="SourceGraphic" in2="flt_tag" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
