import { IGetRateResp } from "@/type";
import { useState, useEffect } from "react";

function useFetchCurrentRates() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentRates, setCurrentRates] = useState({} as IGetRateResp);
  const [oldRates, setOldRates] = useState({} as IGetRateResp);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const currentResp = await fetch(`${process.env.NEXT_PUBLIC_API}/rates`);
        const currentJson: IGetRateResp = await currentResp.json();
        setCurrentRates(currentJson);

        const oldResp = await fetch(`${process.env.NEXT_PUBLIC_API}/old`);
        const oldJson: IGetRateResp = await oldResp.json();
        setOldRates(oldJson);
      } catch (err) {
        setError("Failed to fetch rates");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { currentRates, oldRates, loading, error };
}

export { useFetchCurrentRates };
