"use client";

import React from "react";
import { PropsWithChildren } from "react";

// Temporary placeholder for KBar provider
export default function KBarProviderTemp({
  children,
}: PropsWithChildren<{
  onSetLeague: (league: Results.Leagues) => void;
}>) {
  return <>{children}</>;
}