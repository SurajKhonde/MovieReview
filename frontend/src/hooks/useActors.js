import { getActors } from "../api/actor";
import { useQuery } from "@tanstack/react-query";

// Just returns the array directly
export const getActorsdata = async (page, limit) => {
  const { profiles } = await getActors(page, limit);
  return profiles;
};

export const useActors = (page, limit) => {
  return useQuery({
    queryKey: ["actors", page],
    queryFn: () => getActorsdata(page, limit), // call the one that returns just array
    // staleTime: 60 * 1000,
    refetchOnWindowFocus: false, // don't refetch on tab switch
    refetchOnMount: false,       // don't refetch if data is cached
  });
};
