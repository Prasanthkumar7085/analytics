const userAndRestrcitions: any = {
  MARKETER: [],
  HOSPITAL_MARKETING_MANAGER: ["/sales-representatives", "/dashboard"],
};
export const hasAccessOrNot = (pageName: string, userType: string) => {
  let accessedOrNot = userAndRestrcitions.hasOwnProperty(userType)
    ? userAndRestrcitions[userType]?.length
      ? userAndRestrcitions[userType]?.includes(pageName)
      : false
    : true;

  return accessedOrNot;
};
