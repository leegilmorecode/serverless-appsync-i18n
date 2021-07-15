function getErrorTypes(locale = "uk") {
  const errorTypes = {
    uk: {
      noDataErrorType: "NoData",
      accessDeniedErrorType: "AccessDenied",
      invalidValueErrorType: "InvalidValue",
    },
    fr: {
      noDataErrorType: "PasDeDonnées",
      accessDeniedErrorType: "AccèsRefusé",
      invalidValueErrorType: "ValeurInvalide",
    },
  };
  return errorTypes[locale];
}

module.exports = { getErrorTypes };
