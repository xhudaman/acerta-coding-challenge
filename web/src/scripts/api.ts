export type Customer = {
  id: number;
  name: string;
  minTotalFruit: number;
  maxTotalFruit: number;
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

export const updateCustomer = async (customer: Customer ): Promise<Customer> => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/customers/${customer.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(customer)
    
  });
  return res.json();
}
