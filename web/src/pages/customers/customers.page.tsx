import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getCustomers } from "../../scripts/api";

const CustomersPage = () => {
  const {
    data: customers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading customers...</div>;
  return (
    <div className="flex justify-center items-center p-6 ">
      <table className="w-full max-w-2xl table-auto border-collapse">
        <thead>
          <tr className="bg-gray-400">
            <th className="border border-black text-center px-4">ID</th>
            <th className="border border-black text-center px-4">Name</th>
            <th className="border border-black text-center px-4">
              Min Total Fruits
            </th>
            <th className="border border-black text-center px-4">
              Max Total Fruits
            </th>
          </tr>
        </thead>
        <tbody>
          {customers?.map((customer) => (
            <tr key={customer.id}>
              <td className="border border-black text-center px-4">
                <Link
                  to={`/customers/${customer.id}`}
                  className="text-blue-400 underline hocus:text-blue-600 hocus:outline-none"
                >
                  {customer.id}
                </Link>
              </td>
              <td className="border border-black text-center px-4">
                {customer.name}
              </td>
              <td className="border border-black text-center px-4">
                {customer.minTotalFruit}
              </td>
              <td className="border border-black text-center px-4">
                {customer.maxTotalFruit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// <div>
//
// </div>
export default CustomersPage;
