import * as React from "react";

export interface HelloProps { compiler: string; framework: string; }

export const InlineEditor = (props: HelloProps) => <h1>This is inline component!</h1>;