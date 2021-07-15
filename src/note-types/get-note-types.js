function getNoteTypes(locale = "uk") {
  const types = {
    uk: [
      {
        noteTypeId: 1,
        type: "Draft",
      },
      {
        noteTypeId: 2,
        type: "Published",
      },
    ],
    fr: [
      {
        noteTypeId: 1,
        type: "Brouillon",
      },
      {
        noteTypeId: 2,
        type: "Publié",
      },
    ],
  };

  return {
    noteTypes: JSON.stringify(types[locale]),
  };
}

module.exports = { getNoteTypes };
