import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Customer as CustomerType,
  Fruit,
  FruitWithMinMax,
  getCustomer,
  getFruits,
  updateCustomer,
} from "../../scripts/api";
import { FaPlus } from "react-icons/fa";
import { BsChevronExpand } from "react-icons/bs";

const Customer = () => {
  const { id } = useParams();
  const [fruitsState, setFruitsState] = useState<FruitWithMinMax[] | []>([]);
  const [selectedFruit, setSelectedFruit] = useState<Fruit | null>(null);
  const totalMinFruits = useRef<HTMLInputElement>(null);
  const totalMaxFruits = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const filteredFruit = useMemo(() => {
    if (fruits) {
      return fruitsState.length > 0
        ? fruits.filter((fruit: Fruit) =>
            fruitsState.find((item) => item.id !== fruit.id)
          )
        : fruits;
    }
  }, [fruits, fruitsState]);

  useEffect(() => {
    // Load default fruitsState from customer
    if (customer && customer.fruits?.length > 0) {
      const customerFruits = customer.fruits.map((fruit) => ({
        ...fruit,
        min: fruit.min || 0,
        max: fruit.max || 0,
      }));

      setFruitsState(customerFruits);
    }
  }, [customer]);

  const mutation = useMutation({
    mutationFn: (customer: CustomerType) => {
      mutationFn: return updateCustomer(customer);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["customers", data.id],
        refetchActive: true,
      });

      navigate("/customers");
    },
  });

  const handleFruitPreferenceChange = (
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

  const validateData = (customer: CustomerType): boolean => {
    const maximumAllowedFruit =
      customer.maxTotalFruit - customer.minTotalFruit + 1;

    const totalMaxFruit = customer.fruits.reduce(
      (accumulator: number, currentValue: FruitWithMinMax): number => {
        return accumulator + currentValue.max;
      },
      0
    );

    const totalMinFruit = customer.fruits.reduce(
      (accumulator: number, currentValue: FruitWithMinMax): number => {
        return accumulator + currentValue.min;
      },
      0
    );

    console.log("validating data", {
      maximumAllowedFruit,
      totalMaxFruit,
      minAllowedFruit: customer.minTotalFruit,
      totalMinFruit,
    });

    if (totalMaxFruit > maximumAllowedFruit) return false;
    if (totalMinFruit < customer.minTotalFruit) return false;

    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (customer) {
      const minTotalFruit = totalMinFruits.current?.value
        ? parseInt(totalMinFruits.current?.value)
        : customer.minTotalFruit;

      const maxTotalFruit = totalMaxFruits.current?.value
        ? parseInt(totalMaxFruits.current?.value)
        : customer.maxTotalFruit;

      const updatedCustomer = {
        ...customer,
        minTotalFruit,
        maxTotalFruit,
      };

      updatedCustomer.fruits =
        updatedCustomer.fruits && updatedCustomer?.fruits.length > 0
          ? [...updatedCustomer.fruits, ...fruitsState]
          : [...fruitsState];

      console.log("submitting", { updatedCustomer });

      if (!validateData(updatedCustomer))
        return alert(
          "Fruit preferences cannot exceed the minimum or maximum fruit in the basket!"
        );
      mutation.mutate(updatedCustomer);
    }
  };

  if (customerLoading || fruitsLoading) return <div>Loading...</div>;
  if (customerError) return <div>Error loading customer</div>;
  if (fruitsError) return <div>Error loading fruits</div>;

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-2xl py-6">
      <h2 className="text-2xl font-bold">{customer?.name}</h2>
      <form
        className="flex flex-col space-y-8 w-full justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-full">
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
        </div>
        <div className="w-full space-y-4">
          <h3 className="text-xl font-semibold mb-2 mr-auto">
            Fruit Preferences
          </h3>
          <div className="flex justify-center items-center w-full space-x-4">
            {filteredFruit && (
              <Listbox value={selectedFruit} onChange={setSelectedFruit}>
                <div className="relative mt-1 w-1/2">
                  <div className="flex justify-center items-center space-x-4">
                    <Listbox.Button className="flex bg-gray-200 px-4 py-2 rounded w-full text-left items-center">
                      {selectedFruit?.name || "Select Fruit"}
                      <BsChevronExpand className="ml-auto text-xl" />
                    </Listbox.Button>
                    <button
                      type="button"
                      className="rounded bg-gray-400 px-4 py-2 hocus:bg-gray-600 text-white"
                      onClick={handleAddFruit}
                    >
                      <FaPlus className="text-2xl" />
                    </button>
                  </div>
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
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {fruit.name}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            )}
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
                        handleFruitPreferenceChange(
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
                        handleFruitPreferenceChange(
                          fruit,
                          "max",
                          parseInt(target.value)
                        )
                      }
                    />
                  </td>
                  <td className="border border-black text-center px-4 py-2">
                    <button
                      className="bg-red-600 p-2 rounded text-white hocus:bg-red-500"
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
        </div>

        <button
          type="submit"
          className="rounded bg-green-600 hocus:bg-green-400 w-1/4 px-4 py-2 text-white"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Customer;
