function getErrorMessages(locale = "uk") {
  const errorMessages = {
    uk: {
      noDataErrorMessage: "No data",
      accessDeniedErrorMessage: "Access denied",
      invalidValueErrorMessage: "The value {0} is invalid",
    },
    fr: {
      noDataErrorMessage: "Pas de données",
      accessDeniedErrorMessage: "Accès refusé",
      invalidValueErrorMessage: "La valeur {0} est invalide",
    },
  };
  return errorMessages[locale];
}

module.exports = { getErrorMessages };
