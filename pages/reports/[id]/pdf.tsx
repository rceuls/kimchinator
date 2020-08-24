import React from "react";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../../components/PdfReport"),
  { ssr: false }
);

export default function PdfReportDynamic() {
  return <DynamicComponentWithNoSSR />;
}
