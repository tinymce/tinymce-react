import * as React from "react";

export interface HelloProps { compiler: string; framework: string; }

export const IframeEditor = (props: HelloProps) => <h1>This is iframe component!</h1>;