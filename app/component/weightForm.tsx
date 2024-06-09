"use client";

import { useState } from "react";
import { subscales, subscalesRev, pairwises } from "@/app/component/constant";

export default function WeightForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    let tmp: { [id: string]: number } = {
      MD: 0,
      PD: 0,
      TD: 0,
      PF: 0,
      EF: 0,
      FR: 0,
    };
    pairwises.forEach((value) => {
      tmp[subscalesRev[formJson[value].toString()]] += 1;
    });

    setWeightResult(tmp);
  }

  const [weightResult, setWeightResult] = useState<{ [id: string]: number }>({
    MD: 0,
    PD: 0,
    TD: 0,
    PF: 0,
    EF: 0,
    FR: 0,
  });

  const [isEnable, setIsEnable] = useState(false);

  const pairList = pairwises.map((value) => (
    <SelectWeight
      id={pairwises.indexOf(value) + 1}
      pname={value}
      op1={subscales[value.split("-")[0]]}
      op2={subscales[value.split("-")[1]]}
    />
  ));

  return (
    <div className="flex flex-row">
      <form
        method="post"
        onSubmit={handleSubmit}
        className="w-fit flex flex-col items-center p-4"
      >
        {pairList}
        <SubmitButton />
      </form>
      <WeightTable {...weightResult} />
    </div>
  );
}

interface SWProps {
  id: number;
  pname: string;
  op1: string;
  op2: string;
}
function SelectWeight({ id, pname, op1, op2 }: SWProps) {
  return (
    <div className="flex flex-row">
      <p className="p-2">{id}.</p>
      <fieldset className="grid grid-cols-2 gap-4 my-4">
        <div>
          <label className="w-36 block cursor-pointer rounded-lg border border-gray-100 bg-white p-2 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
            <div>
              <p className="mt-1 text-gray-900 text-xs">{op1}</p>
            </div>

            <input
              type="radio"
              name={pname}
              value={op1}
              className="sr-only"
              required
            />
          </label>
        </div>
        <div>
          <label className="w-36 block cursor-pointer rounded-lg border border-gray-100 bg-white p-2 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
            <div>
              <p className="mt-1 text-gray-900 text-xs">{op2}</p>
            </div>

            <input type="radio" name={pname} value={op2} className="sr-only" />
          </label>
        </div>
      </fieldset>
    </div>
  );
}

function SubmitButton() {
  return (
    <span className="mt-6 w-fit inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
      <button
        type="reset"
        className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:relative"
      >
        Clear
      </button>

      <button
        type="submit"
        className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:relative"
      >
        Submit
      </button>
    </span>
  );
}

function WeightTable(weightResult: { [id: string]: number }) {
  return (
    <div className="mx-4">
      <p className="text-xl mb-2">Weight Result:</p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm rounded-lg">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Mental Demand
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {weightResult["MD"]}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Physical Demand
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {weightResult["PD"]}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Temporal Demand
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {weightResult["TD"]}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Performance
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {weightResult["PF"]}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Effort
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {weightResult["EF"]}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Frustration
              </td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {weightResult["FR"]}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
