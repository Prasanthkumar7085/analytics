import { handleAPIErrorResponse } from "@/lib/httpErrorHandler";
import { $globalFetch } from "@/lib/labsquireFetch";
import { $LabsquireFetch } from "@/lib/labsquireFetch";

export const getAllPatientResultsAPI = async (params: any) => {
  try {
    const { success, data } = await $globalFetch.get(
      "/patient-results",
      params
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getSinglePatientResultAPI = async (id: any) => {
  try {
    const { success, data } = await $LabsquireFetch.get(`/patients/${id}`);
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getAllPatientNamesAPI = async (params: any) => {
  try {
    const { success, data } = await $globalFetch.get(
      "/patient-results/tests",
      params
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getAllPatientDetailsAPI = async (params: any) => {
  try {
    const { success, data } = await $LabsquireFetch.get(
      "/patients-list",
      params
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getAllToxicologyPatientResultsAPI = async (params: any) => {
  try {
    const { success, data } = await $globalFetch.get(
      "/toxicology-results",
      params
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getAllToxicologyPatientRangesAPI = async (params: any) => {
  try {
    const { success, data } = await $globalFetch.get(
      "/toxicology-results/config",
      params
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const getAllToxocologyPatientDetailsAPI = async (params: any) => {
  try {
    const { success, data } = await $globalFetch.get(
      "/toxicology-results/patient-details",
      params
    );
    if (!success) {
      return handleAPIErrorResponse(data);
    }
    return data;
  } catch (err) {
    throw err;
  }
};
