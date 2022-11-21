type Customer = {
  id: number;
  name: string;
  minTotalFruit: number;
  maxTotalFruit: number;
  fruit: Record<any,Number[]>
  fruits: FruitWithMinMax[]
}

export type Fruit = {
  id: number;
  name: string;
}

export type FruitWithMinMax = Fruit & {
  min: number;
  max: number;
}

export const getCustomers = async (): Promise<Customer[]> => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/customers`);
  return res.json();
};

export const getCustomer = async (id: string | undefined): Promise<Customer> => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/customers/${id}`);
  return res.json();
};

export const getFruits = async (): Promise<Fruit[]> => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/fruits`);
  return res.json();
};
