"use client";

import { ReactNode, useState } from "react";

const subscales: { [id: string]: string } = {
  MD: "Mental Demand",
  PD: "Physical Demand",
  TD: "Temporal Demand",
  PF: "Performance",
  EF: "Effort",
  FR: "Frustration",
};

export default function WeightForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.target;
    console.log(form);
  }

  const [pairwise, setPairwise] = useState<{ [id: string]: string | null }>({
    "MD-PD": null,
    "MD-TD": null,
    "MD-PF": null,
    "MD-EF": null,
    "MD-FR": null,
    "PD-TD": null,
    "PD-PF": null,
    "PD-EF": null,
    "PD-FR": null,
    "TD-PF": null,
    "TD-EF": null,
    "TD-FR": null,
    "PF-EF": null,
    "PF-FR": null,
    "EF-FR": null,
  });

  const pairList = Object.keys(pairwise).map((value) => (
    <SelectWeight
      pname={value}
      op1={subscales[value.split("-")[0]]}
      op2={subscales[value.split("-")[1]]}
    />
  ));

  return (
    <div>
      <form
        method="post"
        onSubmit={handleSubmit}
        className="w-fit flex flex-col gap-4 items-center"
      >
        <h1 className="text-4xl font-bold">Pairwise Weight</h1>
        {pairList}
        <SubmitButton />
      </form>
    </div>
  );
}

interface SWProps {
  pname: string;
  op1: string;
  op2: string;
}
function SelectWeight({ pname, op1, op2 }: SWProps) {
  return (
    <div className="flex flex-row justify-center">
      <label className="w-48 mx-2 inline-flex flex-row justify-end">
        {op1}
        <input type="radio" name={pname} value={op1} className="mx-2" />
      </label>
      <label className="w-48 mx-2 inline-flex flex-row justify-start">
        <input type="radio" name={pname} value={op2} className="mx-2" />
        {op2}
      </label>
    </div>
  );
}

function SubmitButton() {
  return (
    <span className="w-fit inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
      <button
        type="button"
        className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:relative"
      >
        Clear
      </button>

      <button
        type="submit"
        className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:relative"
      >
        Submit
      </button>
    </span>
  );
}
