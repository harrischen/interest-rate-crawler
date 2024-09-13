import { IGetRateResp } from "@/type";
import { useState, useEffect } from "react";

function useFetchRates() {
  const [data, setData] = useState({} as IGetRateResp);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/rates`);
        const json: IGetRateResp = await response.json();
        setData(json);
      } catch (err) {
        setError("Failed to fetch rates");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { data, loading, error };
}

export default useFetchRates;
