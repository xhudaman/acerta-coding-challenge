import { Fragment, useRef } from "react";

const customer = {
  id: "a",
  name: "Anton",
  minTotalFruit: 1,
  maxTotalFruit: 10,
};

const Customer = () => {
  const totalMinFruits = useRef<HTMLInputElement>(null);
  const totalMaxFruits = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h2 className="text-2xl">{customer.name}</h2>
      <form
        className="flex flex-col space-y-2 w-full justify-center items-center"
        onSubmit={(event) => {
          event.preventDefault();
          console.log("submitting", {
            totalMin: totalMinFruits.current?.value,
            totalMax: totalMaxFruits.current?.value,
          });
        }}
      >
        <input
          ref={totalMinFruits}
          type="number"
          name="min-total"
          className="border border-black w-1/2"
        />
        <input
          ref={totalMaxFruits}
          type="number"
          name="max-total"
          className="border border-black w-1/2"
        />
        <button
          type="submit"
          className="rounded bg-green-500 hocus:bg-green-700 w-1/4"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Customer;
