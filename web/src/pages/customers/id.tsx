import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import { useQuery } from "react-query";
import { FruitWithMinMax, getCustomer, getFruits } from "../../scripts/api";

type fruit = {
  id: number;
  name: string;
};

const Customer = () => {
  const { id } = useParams();
  const [fruitsState, setFruitsState] = useState<FruitWithMinMax[] | []>([]);
  const {
    data: customer,
    isLoading: customerLoading,
    isError: customerError,
  } = useQuery({
    queryKey: ["customers", id],
    queryFn: () => getCustomer(id),
  });
  const {
    data: fruits,
    isLoading: fruitsLoading,
    isError: fruitsError,
  } = useQuery({
    queryKey: ["fruits"],
    queryFn: () => getFruits(),
  });

  const totalMinFruits = useRef<HTMLInputElement>(null);
  const totalMaxFruits = useRef<HTMLInputElement>(null);

  const filteredFruit = useMemo(() => {
    if (fruits) {
      return fruitsState.length > 0
        ? fruits.filter((fruit: fruit) =>
            fruitsState.find((item) => item.id !== fruit.id)
          )
        : fruits;
    }
  }, [fruits, fruitsState]);

  useEffect(() => {
    if (customer && customer.fruits?.length > 0) {
      const customerFruits = customer.fruits.map((fruit) => ({
        ...fruit,
        min: 0,
        max: 0,
      }));

      setFruitsState(customerFruits);
    }
  }, [customer]);

  const [selectedFruit, setSelectedFruit] = useState<fruit | null>(null);

  if (customerLoading || fruitsLoading) return <div>Loading...</div>;
  if (customerError) return <div>Error loading customer</div>;
  if (fruitsError) return <div>Error loading fruits</div>;

  const handleMinMaxInpputChange = (
    fruit: FruitWithMinMax,
    key: string,
    value: number
  ) => {
    const newState = [...fruitsState!];

    const index = newState.findIndex((item) => item.id === fruit.id);

    newState[index] = { ...fruit, [key]: value || 0 };

    setFruitsState(newState);
  };

  const handleDeleteFruit = (id: number) => {
    const newState = [...fruitsState!].filter((fruit) => fruit.id !== id);

    setFruitsState(newState);
  };

  const handleAddFruit = () => {
    if (!selectedFruit) return;

    setFruitsState((previous) => {
      return previous
        ? [...previous, { ...selectedFruit, min: 0, max: 0 }]
        : [{ ...selectedFruit, min: 0, max: 0 }];
    });

    setSelectedFruit(null);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-2xl py-6">
      <h2 className="text-2xl font-bold">{customer?.name}</h2>
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
        <h3 className="text-xl font-semibold mb-2 mr-auto">
          Total Fruit in Basket
        </h3>
        <div className="flex w-full space-x-4">
          <div className="flex flex-col w-full justify-center items-center">
            <label htmlFor="min-total" className="mr-auto">
              Min
            </label>
            <input
              ref={totalMinFruits}
              type="number"
              name="min-total"
              id="min-total"
              className="border border-black rounded w-full px-2"
              defaultValue={customer?.minTotalFruit}
            />
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <label htmlFor="max-total" className="mr-auto">
              Max
            </label>
            <input
              ref={totalMaxFruits}
              type="number"
              name="max-total"
              id="max-total"
              className="border border-black rounded w-full px-2"
              defaultValue={customer?.maxTotalFruit}
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 mr-auto">
          Fruit Preferences
        </h3>
        <div className="flex flex-col justify-center items-center w-full">
          {filteredFruit && (
            <Listbox value={selectedFruit} onChange={setSelectedFruit}>
              <div className="relative mt-1 w-1/2">
                <Listbox.Button className="bg-gray-200 px-4 py-2 rounded w-full">
                  {selectedFruit?.name || "Select Fruit"}
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredFruit.map((fruit) => (
                    <Listbox.Option
                      key={fruit.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={fruit}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {fruit.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              Check
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          )}
          <button type="button" onClick={handleAddFruit}>
            Add Fruit
          </button>
        </div>
        <table className="w-full max-w-2xl table-auto border-collapse">
          <thead>
            <tr className="bg-gray-400">
              <th className="border border-black text-left px-4">ID</th>
              <th className="border border-black text-left px-4">Name</th>
              <th className="border border-black text-left px-4">Min</th>
              <th className="border border-black text-left px-4">Max</th>
              <th className="border border-black text-left px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fruitsState?.map((fruit) => (
              <tr key={fruit.id}>
                <td className="border border-black text-center px-4">
                  {fruit.id}
                </td>
                <td className="border border-black text-center px-4">
                  {fruit.name}
                </td>
                <td className="border border-black text-center px-4">
                  <label htmlFor={`min-${fruit.name}`} className="hidden">
                    Min
                  </label>
                  <input
                    type="number"
                    name={`min-${fruit.name}`}
                    id={`min-${fruit.name}`}
                    className="border border-black rounded w-full px-2"
                    value={fruit.min}
                    onChange={({ target }) =>
                      handleMinMaxInpputChange(
                        fruit,
                        "min",
                        parseInt(target.value)
                      )
                    }
                  />
                </td>
                <td className="border border-black text-center px-4">
                  <label htmlFor={`max-${fruit.name}`} className="hidden">
                    Max
                  </label>
                  <input
                    type="number"
                    name={`max-${fruit.name}`}
                    id={`max-${fruit.name}`}
                    className="border border-black rounded w-full px-2"
                    value={fruit.max}
                    onChange={({ target }) =>
                      handleMinMaxInpputChange(
                        fruit,
                        "max",
                        parseInt(target.value)
                      )
                    }
                  />
                </td>
                <td className="border border-black text-center px-4 py-2">
                  <button
                    className="bg-red-600 p-2 rounded hocus:bg-red-500"
                    type="button"
                    onClick={() => handleDeleteFruit(fruit.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
