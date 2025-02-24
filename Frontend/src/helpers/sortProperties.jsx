// src/helpers/sortProperties.jsx
export const sortProperties = (properties, sortBy) => {
  if (!properties || properties.length === 0) return [];

  switch (sortBy) {
    case "Newest":
      return [...properties].sort(
        (a, b) => new Date(b.listedDate) - new Date(a.listedDate)
      );

    case "Price (low to high)":
      return [...properties].sort((a, b) => a.price - b.price);

    case "Price (high to low)":
      return [...properties].sort((a, b) => b.price - a.price);

    case "Square feet":
      return [...properties].sort(
        (a, b) => (b.details.sqft || 0) - (a.details.sqft || 0)
      );

    case "Lot size":
      return [...properties].sort(
        (a, b) => (b.details.lotSize || 0) - (a.details.lotSize || 0)
      );

    case "Price/sq. ft.":
      return [...properties].sort((a, b) => {
        const pricePerSqFtA = a.details.sqft
          ? a.price / a.details.sqft
          : Infinity;
        const pricePerSqFtB = b.details.sqft
          ? b.price / b.details.sqft
          : Infinity;
        return pricePerSqFtA - pricePerSqFtB;
      });

    default:
      return properties;
  }
};
