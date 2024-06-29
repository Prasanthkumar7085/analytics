import { store } from "@/Redux";

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

export const adminAccess = () => {
  let userDetails = store.getState();
  const userType = userDetails?.auth?.user?.user_details?.user_type;
  if (userType == "LAB_ADMIN" || userType == "LAB_SUPER_ADMIN") {
    return true;
  }
  return false;
}