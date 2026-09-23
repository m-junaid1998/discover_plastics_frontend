export const dataToQueryParameter = (data: any): string => {
  if (typeof data === "object" && data !== null) {
    if (!Array.isArray(data)) {
      let params = "?";
      const dataArray = Object.entries(data);
      if (dataArray.length > 0) {
        dataArray.forEach((entry, index) => {
          const amp = index < dataArray.length - 1 ? "&" : "";
          params = `${params}${entry[0]}=${entry[1]}${amp}`;
        });
        return params;
      }
    }
  } else if (typeof data === "string") {
    return data;
  }
  return "";
};