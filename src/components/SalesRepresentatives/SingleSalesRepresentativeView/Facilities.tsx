import { getFacilitiesBySalesRepId } from "@/services/salesRepsAPIs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Facilities = () => {
  const { id } = useParams();
  const getSalesRepFacilities = async () => {
    try {
      const response = await getFacilitiesBySalesRepId({ id: id as string });
      console.log(response, "asdfasdf");
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getSalesRepFacilities();
  }, []);
  return <div></div>;
};

export default Facilities;
