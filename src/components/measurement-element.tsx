export default function MeasurementElement() {
  return (
    <div
      id="measurement-element"
      className="pointer-events-auto invisible absolute inset-0 -z-50 h-screen w-full select-none"
    />
  );
}

//  Used to get the viewport height including mobile browser bars to prevent layout shift when bars hide/show

//  Used to get the viewport width excluding scrollbar width to line up css transforms and clip paths
