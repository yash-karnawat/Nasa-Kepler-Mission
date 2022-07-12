import { useCallback, useEffect, useState } from 'react';

import { httpGetPlanets } from './requests';

function usePlanets() {
  const [planets, savePlanets] = useState([]);

  console.log(planets);

  const getPlanets = useCallback(async () => {
    const fetchedPlanets = await httpGetPlanets();
    savePlanets(fetchedPlanets);
  }, []);

  useEffect(() => {
    getPlanets();
  }, [getPlanets]);

  return planets;
}

export default usePlanets;
