import { useState } from "react";
import filterIcon from "../assets/icons/filter.svg";

function Banner({ title, actionBanner, actionBanner2, callToAction, filterContent }) {

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const style = {
    display: "flex",
    width: "100%",
    height: "100px",
    padding: "0 20px",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  };

  return (
    <>
      <div style={style}>
        <h1>{title}</h1>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>

          {actionBanner && actionBanner}
          {actionBanner2 && actionBanner2}
          {callToAction && callToAction}

          {/* Bouton filtre — visible uniquement en mobile/tablette via CSS,
              affiché seulement si filterContent est fourni */}
          {filterContent && (
            <button
              className={`filter-toggle-btn${isFilterOpen ? " filter-toggle-btn--active" : ""}`}
              onClick={() => setIsFilterOpen(prev => !prev)}
              aria-label="Afficher les filtres"
            >
              <img
                src={filterIcon}
                alt="Filtres"
                style={{ width: "18px", height: "18px", objectFit: "contain" }}
              />
            </button>
          )}
        </div>

        {/* Popup filtre — s'ouvre sous la banner en mobile/tablette */}
        {filterContent && isFilterOpen && (
          <div className="filter-popup">
            {filterContent}
          </div>
        )}
      </div>

      {/* Overlay pour fermer le popup en cliquant ailleurs */}
      {filterContent && isFilterOpen && (
        <div
          className="filter-overlay"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </>
  );
}

export default Banner;