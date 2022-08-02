const Statistiques = () => {
  return (
    <div className="w-3/4 flex flex-col gap-4 m-auto">
      <h1 className="text-2xl font-bold mt-8 w-full text-center">
        Statistiques
      </h1>
      <form action="" className="flex justify-center gap-2">
        <label htmlFor="" className="input-group w-fit">
          <span>Produit</span>
          <select className="select select-bordered"></select>
        </label>
        <label htmlFor="" className="input-group w-fit">
          <span>Timeframe</span>
          <select className="select select-bordered">
            <option value="day">Jour</option>
            <option value="week">Semaine</option>
            <option value="Month">Mois</option>
          </select>
        </label>
        <button className="btn btn-primary btn-outline">Afficher</button>
      </form>
    </div>
  );
};

export default Statistiques;
